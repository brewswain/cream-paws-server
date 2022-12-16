import express, { Request, Response } from "express";
import {
   NotFoundError,
   requireAuth,
   validateRequest,
} from "@cream-paws-util/common";
import { body } from "express-validator";
import { Order } from "../models/order";
import { Customer } from "../models/customer";
import { Chow } from "../models/chow";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
   "/api/orders",
   // requireAuth,
   // [],
   // validateRequest,
   async (req: Request, res: Response) => {
      const {
         delivery_date,
         payment_made,
         payment_date,
         is_delivery,
         quantity,
         driver_paid,
         warehouse_paid,
         customer_id,
         chow_id,
      } = req.body;

      const customer = await Customer.findById(customer_id);
      if (!customer) {
         throw new Error("customer not found");
      }

      const chow = await Chow.findById(chow_id);
      if (!chow) {
         throw new Error("chow not found");
      }

      const order = Order.build({
         delivery_date,
         payment_made,
         payment_date,
         is_delivery,
         quantity,
         driver_paid,
         warehouse_paid,
         customer_id,
         chow_id,
      });

      console.log({ customer });

      await order.save();

      new OrderCreatedPublisher(natsWrapper.client).publish({
         id: order.id,
         version: order.version,
         customer_version: customer.version,
         delivery_date: order.delivery_date,
         payment_made: order.payment_made,
         payment_date: order.payment_date,
         is_delivery: order.is_delivery,
         quantity: order.quantity,
         driver_paid: order.driver_paid,
         warehouse_paid: order.warehouse_paid,
         customer_id: order.customer_id,
         chow_id: order.chow_id,
      });

      res.status(201).send(order);
   }
);

export { router as createOrderRouter };
