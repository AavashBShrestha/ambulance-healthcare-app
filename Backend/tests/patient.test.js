const request = require("supertest");
const db = require("./setup");
const app = require("../src/app");

const signupAs = async (role, suffix = role) => {
  const agent = request.agent(app);
  await agent.post("/api/v1/auth/signup").send({
    username: `user-${suffix}`,
    email: `${suffix}@example.com`,
    password: "Str0ng!Pass",
    role,
  });
  return agent;
};

const history = {
  name: "Test Patient",
  medicalHistory: "Asthma since childhood",
  allergies: "Penicillin",
  currentMedications: "Inhaler",
  emergencyContacts: ["9800000000"],
  bloodGroup: "O+",
};

beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.disconnect);

describe("/api/v1/patient/history", () => {
  it("save and get history", async () => {
    const patient = await signupAs("patient");

    const created = await patient.post("/api/v1/patient/history").send(history);
    expect(created.status).toBe(201);
    expect(created.body.record.bloodGroup).toBe("O+");

    const list = await patient.get("/api/v1/patient/history");
    expect(list.status).toBe(200);
    expect(list.body.records).toHaveLength(1);
  });

  it("user id comes from token", async () => {
    const patient = await signupAs("patient");
    const res = await patient
      .post("/api/v1/patient/history")
      .send({ ...history, user: "507f1f77bcf86cd799439011" });

    const me = await patient.get("/api/v1/auth/me");
    expect(res.body.record.user).toBe(me.body.user._id);
  });

  it("cant see other patients records", async () => {
    const first = await signupAs("patient", "first");
    const second = await signupAs("patient", "second");
    await first.post("/api/v1/patient/history").send(history);

    const res = await second.get("/api/v1/patient/history");
    expect(res.body.records).toHaveLength(0);
  });

  it("invalid data", async () => {
    const patient = await signupAs("patient");
    const res = await patient
      .post("/api/v1/patient/history")
      .send({ ...history, bloodGroup: "Z+", emergencyContacts: ["abc"] });

    expect(res.status).toBe(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it("other roles blocked", async () => {
    const hospital = await signupAs("hospital");
    expect((await hospital.get("/api/v1/patient/history")).status).toBe(403);
    expect((await request(app).get("/api/v1/patient/history")).status).toBe(401);
  });
});
