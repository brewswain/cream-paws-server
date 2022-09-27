import mongoose from "mongoose";

import { app } from "./app";
import { ChowCreatedListener } from "./events/listeners/chow-created-listener";
import { ChowUpdatedListener } from "./events/listeners/chow-updated-listener";
import { CustomerCreatedListener } from "./events/listeners/customer-created-listener";
import { CustomerDeletedListener } from "./events/listeners/customer-deleted-listener";
import { CustomerUpdatedListener } from "./events/listeners/customer-updated-listener";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
   if (!process.env.JWT_KEY) {
      throw new Error("Missing JWT_KEY secret");
   }
   if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI must be defined");
   }
   if (!process.env.NATS_CLIENT_ID) {
      throw new Error("NATS_CLIENT_ID must be defined");
   }
   if (!process.env.NATS_URL) {
      throw new Error("NATS_URL must be defined");
   }
   if (!process.env.NATS_CLUSTER_ID) {
      throw new Error("NATS_CLUSTER_ID must be defined");
   }

   // NATS initialization
   try {
      await natsWrapper.connect(
         process.env.NATS_CLUSTER_ID,
         process.env.NATS_CLIENT_ID,
         process.env.NATS_URL
      );

      natsWrapper.client.on("close", () => {
         console.log("NATS connection closed.");
         process.exit();
      });

      process.on("SIGINT", () => natsWrapper.client.close());
      process.on("SIGTERM", () => natsWrapper.client.close());

      await mongoose.connect(process.env.MONGO_URI);
      console.log("Connected to MongoDB");
   } catch (error) {
      console.error(error);
   }

   // NATS List of listeners (nyeheheh say that 3 times fast)
   new ChowCreatedListener(natsWrapper.client).listen();
   new ChowUpdatedListener(natsWrapper.client).listen();

   new CustomerCreatedListener(natsWrapper.client).listen();
   new CustomerUpdatedListener(natsWrapper.client).listen();
   new CustomerDeletedListener(natsWrapper.client).listen();

   app.listen(3000, () => {
      console.log("Listening on port 3000");
   });
};

start();
