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
   requireAuth,
   [],
   validateRequest,
   async (req: Request, res: Response) => {
      const {
         id,
         delivery_date,
         payment_made,
         payment_date,
         is_delivery,
         driver_paid,
         warehouse_paid,
         customer_id,
         chow_id,
      } = req.body;

      const customer = await Customer.findById(customer_id);
      if (!customer) {
         throw new NotFoundError();
      }

      const chow = await Chow.findById(chow_id);
      if (!chow) {
         throw new NotFoundError();
      }

      const order = Order.build({
         id,
         delivery_date,
         payment_made,
         payment_date,
         is_delivery,
         driver_paid,
         warehouse_paid,
         customer_id,
         chow_being_ordered: chow,
      });

      await order.save();

      new OrderCreatedPublisher(natsWrapper.client).publish({
         delivery_date: order.delivery_date,
         payment_made: order.payment_made,
         payment_date: order.payment_date,
         is_delivery: order.is_delivery,
         driver_paid: order.driver_paid,
         warehouse_paid: order.warehouse_paid,
         customer_id: order.customer_id,
         // customer: {

         // }
         chow_being_ordered: chow,
         // id: order.id,
      });

      res.status(201).send(order);
   }
);

export { router as createOrderRouter };
