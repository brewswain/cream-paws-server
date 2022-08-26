import express, { Request, Response } from "express";
import {
   NotFoundError,
   requireAuth,
   validateRequest,
} from "@cream-paws-util/common";
import { Customer } from "../models/customer";

const router = express.Router();

router.put(
   "/api/customer/:id",
   requireAuth,
   [],
   validateRequest,
   async (req: Request, res: Response) => {
      const customer = await Customer.findById(req.params.id);

      if (!customer) {
         throw new NotFoundError();
      }

      customer.set({
         name: req.body.name,
         pets: req.body.pets,
      });
      await customer.save();

      res.send(customer);
   }
);

export { router as updateCustomerRouter };
