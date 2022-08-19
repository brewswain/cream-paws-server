import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";

it("Returns a 404 if the provided id doesn't exist", async () => {
   const id = new mongoose.Types.ObjectId().toHexString();

   await request(app)
      .put(`/api/stock/${id}`)
      .set("Cookie", global.signup())
      .send({
         title: "dfds",
         price: 20,
      })
      .expect(404);
});

it("Returns a 401 if the user is not authenticated", async () => {
   const id = new mongoose.Types.ObjectId().toHexString();

   await request(app)
      .put(`/api/stock/${id}`)
      .send({
         title: "dsfds",
         price: 20,
      })
      .expect(401);
});

it("Returns a 401 if the user doesn't own the stock", async () => {
   const response = await request(app)
      .post("/api/stock")
      .set("Cookie", global.signup())
      .send({
         title: "dsfgfdf",
         price: 20,
      });

   await request(app)
      .put(`/api/stock/${response.body.id}`)
      // We "sign up/in" again to give us a random id so that the code thinks we're a different
      // user
      .set("Cookie", global.signup())
      .send({
         title: "dsfgfdf22222",
         price: 2022222,
      })
      .expect(401);
});

it("Returns a 400 if the user provides an invalid title or price", async () => {
   const cookie = global.signup();
   const response = await request(app)
      .post("/api/stock")
      .set("Cookie", cookie)
      .send({
         title: "dsfgfdf",
         price: 20,
      });

   await request(app)
      .put(`/api/stock/${response.body.id}`)
      .set("Cookie", cookie)
      .send({
         title: "",
         price: 20,
      })
      .expect(400);

   await request(app)
      .put(`/api/stock/${response.body.id}`)
      .set("Cookie", cookie)
      .send({
         title: "dsfdsfs",
         price: -10,
      })
      .expect(400);
});

it("Updates the stock if provided valid inputs", async () => {
   const cookie = global.signup();
   const response = await request(app)
      .post("/api/stock")
      .set("Cookie", cookie)
      .send({
         title: "dsfgfdf",
         price: 20,
      });

   await request(app)
      .put(`/api/stock/${response.body.id}`)
      .set("Cookie", cookie)
      .send({
         title: "new title",
         price: 100,
      })
      .expect(200);

   const stockResponse = await request(app)
      .get(`/api/stock/${response.body.id}`)
      .send();

   expect(stockResponse.body.title).toEqual("new title");
   expect(stockResponse.body.price).toEqual(100);
});
