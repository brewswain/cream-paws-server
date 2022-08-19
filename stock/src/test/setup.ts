import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import jwt from "jsonwebtoken";

declare global {
   var signup: () => string[];
}

let mongo: any;
// Hook function -- we're passing in a function that'll run before all of our tests
beforeAll(async () => {
   //TODO: please remove this in prod lol
   process.env.JWT_KEY = "oIqkHeuCkVEuddoR9ktSmhViiu0Oo14Q";

   mongo = await MongoMemoryServer.create();
   const mongoUri = mongo.getUri();

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
   await mongoose.connection.close();
});

global.signup = () => {
   // Build a JWT payload. { id, email }
   const payload = {
      id: new mongoose.Types.ObjectId().toHexString(),
      email: "test@test.com",
   };

   // Create the JWT
   const token = jwt.sign(payload, process.env.JWT_KEY!);

   // Build session object
   const session = { jwt: token };

   // Turn the session into JSON
   const sessionJSON = JSON.stringify(session);

   // Take JSON and encode it as base64
   const base64 = Buffer.from(sessionJSON).toString("base64");

   // Return a string that's the cookie with the encoded data
   return [`session=${base64}`];
};
