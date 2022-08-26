import express, { Request, Response } from "express";
import { NotFoundError } from "@cream-paws-util/common";
import { Customer } from "../models/customer";

const router = express.Router();

router.get("/api/customer", async (req: Request, res: Response) => {
   const customers = await Customer.find({});

   res.send(customers);
});

export { router as getCustomersRouter };
