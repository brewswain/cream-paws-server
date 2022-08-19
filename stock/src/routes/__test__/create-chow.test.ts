import request from "supertest";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("Has a route handler listening to /api/tickets for POST requests", async () => {
   const response = await request(app).post("/api/tickets").send({});

   // once we don't get a 404 we're happy
   expect(response.status).not.toEqual(404);
});

it("Can only be accessed if the user is signed in", async () => {
   await request(app).post("/api/tickets").send({}).expect(401);
});

it("Returns a status other than 401 if the user is signed in", async () => {
   const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signup())
      .send({});

   expect(response.status).not.toEqual(401);
});

it("Returns an error if invalid title is provided", async () => {
   await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signup())
      .send({
         title: "",
         price: 10,
      })
      .expect(400);
});

it("Returns an error if an invalid price is provided", async () => {
   await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signup())
      .send({
         title: "ewrwrwe",
         price: -10,
      })
      .expect(400);

   await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signup())
      .send({
         title: "ewrwrwe",
      })
      .expect(400);
});

it("Creates a ticket with valid inputs", async () => {
   // Finds all of our tickets.
   let tickets = await Ticket.find({});
   expect(tickets.length).toEqual(0);

   await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signup())
      .send({
         title: "dfds",
         price: 20,
      })
      .expect(201);

   tickets = await Ticket.find({});
   expect(tickets.length).toEqual(1);
});