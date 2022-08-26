import express, { Request, Response } from "express";
import { NotFoundError } from "@cream-paws-util/common";
import { app } from "../app";
import { Customer } from "../models/customer";

const router = express.Router();

router.get("/api/customer/:id", async (req: Request, res: Response) => {
   const customer = await Customer.findById(req.params.id);

   if (!customer) {
      throw new NotFoundError();
   }

   res.send(customer);
});

export { router as findCustomerRouter };
