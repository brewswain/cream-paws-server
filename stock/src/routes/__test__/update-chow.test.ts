import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";

it("Returns a 404 if the provided id doesn't exist", async () => {
   const cookie = global.signup();

   // Verifying that user authentication works here. will only give a 201 if user is authorized
   const id = new mongoose.Types.ObjectId().toHexString();
   // await request(app)
   //    .post("/api/stock")
   //    .set("Cookie", cookie)
   //    .send({
   //       brand: "Taste of The Wild",
   //       target_group: "Puppy",
   //       flavour: "Puppy",
   //       size: 20,
   //       unit: "kg",
   //       quantity: 5,
   //       wholesale_price: 20,
   //       retail_price: 30,
   //       is_paid_for: false,
   //    })
   //    .expect(401);

   // same code as above except for route and tryna trigger a 404
   await request(app)
      .put(`/api/stock/${id}`)
      .set("Cookie", cookie)
      .send({
         brand: "Taste of The Wild",
         target_group: "Puppy",
         flavour: "Puppy",
         size: 20,
         unit: "kg",
         quantity: 5,
         wholesale_price: 20,
         retail_price: 30,
         is_paid_for: false,
      })
      .expect(404);
});

it("Returns a 401 if the user is not authenticated", async () => {
   const id = new mongoose.Types.ObjectId().toHexString();

   await request(app)
      .put(`/api/stock/${id}`)
      .send({
         brand: "Taste of The Wild",
         target_group: "Puppy",
         flavour: "Puppy",
         size: 20,
         unit: "kg",
         quantity: 5,
         wholesale_price: 20,
         retail_price: 30,
         is_paid_for: false,
      })
      .expect(401);
});

it("Returns a 400 if the user provides an invalid title or price", async () => {
   const cookie = global.signup();
   const response = await request(app)
      .post("/api/stock")
      .set("Cookie", cookie)
      .send({
         brand: "Taste of The Wild",
         target_group: "Puppy",
         flavour: "Puppy",
         size: 20,
         unit: "kg",
         quantity: 5,
         wholesale_price: 20,
         retail_price: 30,
         is_paid_for: false,
      });

   await request(app)
      .put(`/api/stock/${response.body.id}`)
      .set("Cookie", cookie)
      .send({
         brand: "Taste of The Wild",
         target_group: "Puppy",
         flavour: "Puppy",
         size: 20,
         unit: "",
         quantity: 5,
         wholesale_price: 20,
         retail_price: 30,
         is_paid_for: false,
      })
      .expect(400);

   await request(app)
      .put(`/api/stock/${response.body.id}`)
      .set("Cookie", cookie)
      .send({
         brand: "Taste of The Wild",
         target_group: "Puppy",
         flavour: "",
         size: 20,
         unit: "kg",
         quantity: 5,
         wholesale_price: 20,
         retail_price: 30,
         is_paid_for: false,
      })
      .expect(400);
});

it("Updates the stock if provided valid inputs", async () => {
   const cookie = global.signup();
   const response = await request(app)
      .post("/api/stock")
      .set("Cookie", cookie)
      .send({
         brand: "Taste of The Wild",
         target_group: "Puppy",
         flavour: "Puppy",
         size: 20,
         unit: "kg",
         quantity: 5,
         wholesale_price: 20,
         retail_price: 30,
         is_paid_for: false,
      })
      .expect(201);

   await request(app)
      .put(`/api/stock/${response.body.id}`)
      .set("Cookie", cookie)
      .send({
         brand: "Taste of The Wild 2",
         target_group: "Puppy",
         flavour: "Puppy",
         size: 20,
         unit: "kg",
         quantity: 5,
         wholesale_price: 100,
         retail_price: 30,
         is_paid_for: false,
      })
      .expect(200);

   const stockResponse = await request(app)
      .get(`/api/stock/${response.body.id}`)
      .send();

   expect(stockResponse.body.brand).toEqual("Taste of The Wild 2");
   expect(stockResponse.body.wholesale_price).toEqual(100);
});
