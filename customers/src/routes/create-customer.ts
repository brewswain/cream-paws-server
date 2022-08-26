import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@cream-paws-util/common";

import { Customer } from "../models/customer";

const router = express.Router();

router.post(
   "/api/customer",
   requireAuth,
   [body("name").not().isEmpty().withMessage("Customer name cannot be empty")],
   validateRequest,
   async (req: Request, res: Response) => {
      const { name } = req.body;

      const customer = Customer.build({
         name,
         pets: req.body.pets || [],
      });

      await customer.save();

      res.status(201).send(customer);
   }
);

export { router as createCustomerRouter };
