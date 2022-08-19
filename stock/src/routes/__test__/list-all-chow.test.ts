import request from "supertest";

import { app } from "../../app";

const createTicket = () => {
   return request(app).post("/api/stock").set("Cookie", global.signup()).send({
      title: "dfds",
      price: 20,
   });
};

it("Can fetch a list of tickets", async () => {
   await createTicket();
   await createTicket();
   await createTicket();

   const response = await request(app).get("/api/stock").send().expect(200);

   expect(response.body.length).toEqual(3);
});
