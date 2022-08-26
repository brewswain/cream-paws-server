import request from "supertest";

import { app } from "../../app";

const createChow = () => {
   return request(app).post("/api/stock").set("Cookie", global.signup()).send({
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
};

it("Can fetch a list of tickets", async () => {
   await createChow();
   await createChow();
   await createChow();

   const response = await request(app).get("/api/stock").send().expect(200);

   expect(response.body.length).toEqual(3);
});
