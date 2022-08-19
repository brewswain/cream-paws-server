import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";

it("Returns a 404 if the provided id doesn't exist", async () => {
   const id = new mongoose.Types.ObjectId().toHexString();

   await request(app)
      .put(`/api/tickets/${id}`)
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
      .put(`/api/tickets/${id}`)
      .send({
         title: "dsfds",
         price: 20,
      })
      .expect(401);
});

it("Returns a 401 if the user doesn't own the ticket", async () => {
   const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signup())
      .send({
         title: "dsfgfdf",
         price: 20,
      });

   await request(app)
      .put(`/api/tickets/${response.body.id}`)
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
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({
         title: "dsfgfdf",
         price: 20,
      });

   await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({
         title: "",
         price: 20,
      })
      .expect(400);

   await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({
         title: "dsfdsfs",
         price: -10,
      })
      .expect(400);
});

it("Updates the ticket if provided valid inputs", async () => {
   const cookie = global.signup();
   const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({
         title: "dsfgfdf",
         price: 20,
      });

   await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({
         title: "new title",
         price: 100,
      })
      .expect(200);

   const ticketResponse = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .send();

   expect(ticketResponse.body.title).toEqual("new title");
   expect(ticketResponse.body.price).toEqual(100);
});
