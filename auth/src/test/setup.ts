import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";

import { app } from "../app";

declare global {
   var signup: () => Promise<string[]>;
}

let mongo: any;
// Hook function -- we're passing in a function that'll run before all of our tests
beforeAll(async () => {
   //TODO: please remove this lol
   process.env.JWT_KEY = "oIqkHeuCkVEuddoR9ktSmhViiu0Oo14Q";

   mongo = new MongoMemoryServer();
   const mongoUri = await mongo.getUri();

   await mongoose.connect(mongoUri);
});

// we want to make sure we have a clean database before each test
beforeEach(async () => {
   const collections = await mongoose.connection.db.collections();

   for (let collection of collections) {
      await collection.deleteMany({});
   }
});

// After we run our tests we want to stop our server
afterAll(async () => {
   await mongo.stop();
   await mongo.connection.close();
});

global.signup = async () => {
   const email = "test@test.com";
   const password = "password";

   const response = await request(app)
      .post("/api/uusers/signup")
      .send({ email, password })
      .expect(201);

   const cookie = response.get("Set-Cookie");

   return cookie;
};
