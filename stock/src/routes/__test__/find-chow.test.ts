import mongoose from "mongoose";
import request from "supertest";

import { app } from "../../app";

it("returns a 404 if the ticket is not found", async () => {
   const id = new mongoose.Types.ObjectId().toHexString();

   await request(app).get(`/api/stock/${id}`).send().expect(404);
});

it("returns the ticket if the ticket is found", async () => {
   const size = 20;
   const flavour = "Puppy";

   const response = await request(app)
      .post("/api/stock")
      .set("Cookie", global.signup())
      .send({
         brand: "Taste of The Wild",
         target_group: "Puppy",
         flavour,
         size,
         unit: "kg",
         quantity: 5,
         wholesale_price: 20,
         retail_price: 30,
         is_paid_for: false,
      })
      .expect(201);

   const ticketResponse = await request(app)
      .get(`/api/stock/${response.body.id}`)
      .send()
      .expect(200);

   expect(ticketResponse.body.size).toEqual(size);
   expect(ticketResponse.body.flavour).toEqual(flavour);
});
