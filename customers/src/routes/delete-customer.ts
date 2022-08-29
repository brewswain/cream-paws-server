import express, { Request, Response } from "express";
import {
   NotFoundError,
   requireAuth,
   validateRequest,
} from "@cream-paws-util/common";
import { Customer } from "../models/customer";
import { CustomerDeletedPublisher } from "../events/publishers/customer-deleted-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
   "/api/customer/:id",
   [requireAuth, validateRequest],
   async (req: Request, res: Response) => {
      const customerId = req.params.id;

      await Customer.deleteOne({
         id: customerId,
      });

      new CustomerDeletedPublisher(natsWrapper.client).publish({
         id: customerId,
      });

      res.status(200).send(`Customer id: ${customerId} successfully deleted.`);
   }
);

export { router as deleteCustomerRouter };
