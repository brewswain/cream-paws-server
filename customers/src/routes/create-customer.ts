import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@cream-paws-util/common";

import { Customer } from "../models/customer";
import { CustomerCreatedPublisher } from "../events/publishers/customer-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
   "/api/customer",
   // requireAuth,
   [body("name").not().isEmpty().withMessage("Customer name cannot be empty")],
   // validateRequest,
   async (req: Request, res: Response) => {
      const { name } = req.body;

      const customer = Customer.build({
         name,
         pets: req.body.pets || [],
         orders: [],
      });

      await customer.save();

      new CustomerCreatedPublisher(natsWrapper.client).publish({
         id: customer.id,
         name: customer.name,
         pets: customer.pets || [],
         version: customer.version,
      });

      res.status(201).send(customer);
   }
);

export { router as createCustomerRouter };
