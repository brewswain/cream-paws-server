import express, { Request, Response } from "express";
import {
   NotFoundError,
   requireAuth,
   validateRequest,
} from "@cream-paws-util/common";

import { Customer } from "../models/customer";
import { CustomerUpdatedPublisher } from "../events/publishers/customer-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

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

      new CustomerUpdatedPublisher(natsWrapper.client).publish({
         id: customer.id,
         name: customer.name,
         pets: customer.pets,
      });

      res.send(customer);
   }
);

export { router as updateCustomerRouter };
