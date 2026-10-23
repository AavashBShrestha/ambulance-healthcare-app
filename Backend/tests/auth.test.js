const request = require("supertest");
const db = require("./setup");
const app = require("../src/app");

const validUser = {
  name: "Test Patient",
  username: "patient1",
  email: "patient1@example.com",
  password: "Str0ng!Pass",
  role: "patient",
};

beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.disconnect);

describe("POST /api/v1/auth/signup", () => {
  it("signup works", async () => {
    const res = await request(app).post("/api/v1/auth/signup").send(validUser);

    expect(res.status).toBe(201);
    expect(res.body.user.username).toBe("patient1");
    expect(res.body.user.password).toBeUndefined();
    expect(res.headers["set-cookie"][0]).toMatch(/jwt=.*HttpOnly/);
  });

  it("weak password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({ ...validUser, password: "abc123" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/at least 8 characters/);
  });

  it("cant signup as admin", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({ ...validUser, role: "admin" });

    expect(res.status).toBe(400);
  });

  it("duplicate username", async () => {
    await request(app).post("/api/v1/auth/signup").send(validUser);
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({ ...validUser, email: "other@example.com" });

    expect(res.status).toBe(409);
  });
});

describe("POST /api/v1/auth/login", () => {
  beforeEach(() => request(app).post("/api/v1/auth/signup").send(validUser));

  it("login works", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ username: "patient1", password: validUser.password });

    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe("patient");
    expect(res.headers["set-cookie"][0]).toMatch(/jwt=/);
  });

  it("wrong password / unknown user", async () => {
    const wrongPassword = await request(app)
      .post("/api/v1/auth/login")
      .send({ username: "patient1", password: "Wrong!Pass1" });
    const unknownUser = await request(app)
      .post("/api/v1/auth/login")
      .send({ username: "nobody", password: "Wrong!Pass1" });

    expect(wrongPassword.status).toBe(401);
    expect(unknownUser.status).toBe(401);
    expect(wrongPassword.body.message).toBe(unknownUser.body.message);
  });
});

describe("GET /api/v1/auth/me and logout", () => {
  it("me + logout", async () => {
    const agent = request.agent(app);
    await agent.post("/api/v1/auth/signup").send(validUser);

    const me = await agent.get("/api/v1/auth/me");
    expect(me.status).toBe(200);
    expect(me.body.user.username).toBe("patient1");

    await agent.post("/api/v1/auth/logout");
    const afterLogout = await agent.get("/api/v1/auth/me");
    expect(afterLogout.status).toBe(401);
  });

  it("bearer token", async () => {
    const signup = await request(app).post("/api/v1/auth/signup").send(validUser);
    const token = signup.headers["set-cookie"][0].match(/jwt=([^;]+)/)[1];

    const res = await request(app).get("/api/v1/auth/me").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("no token", async () => {
    const res = await request(app).get("/api/v1/auth/me");
    expect(res.status).toBe(401);
  });
});
