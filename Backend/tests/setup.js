const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongo;

const connect = async () => {
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "test-secret";

  let uri = process.env.TEST_MONGO_URI;
  if (!uri) {
    mongo = await MongoMemoryServer.create();
    uri = mongo.getUri();
  }
  await mongoose.connect(uri);
  await Promise.all(Object.values(mongoose.models).map((model) => model.syncIndexes()));
};

const clear = async () => {
  const collections = await mongoose.connection.db.collections();
  await Promise.all(collections.map((c) => c.deleteMany({})));
};

const disconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongo) await mongo.stop();
};

module.exports = { connect, clear, disconnect };
