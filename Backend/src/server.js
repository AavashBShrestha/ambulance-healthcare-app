require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 3001;

const required = ["MONGO_URI", "JWT_SECRET"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing environment variables: ${missing.join(", ")}. See .env.example.`);
  process.exit(1);
}

let server;

const start = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
  server = app.listen(PORT, () => console.log(`API running on port ${PORT}`));
};

const shutdown = async (signal) => {
  console.log(`${signal} received, shutting down`);
  if (server) await new Promise((resolve) => server.close(resolve));
  await mongoose.connection.close();
  process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
