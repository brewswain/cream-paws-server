import express, { Request, Response } from "express";
import {
   NotFoundError,
   requireAuth,
   validateRequest,
} from "@cream-paws-util/common";
import { body } from "express-validator";
import { Order } from "../models/order";
import { OrderUpdatedPublisher } from "../events/publishers/order-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
   "/api/orders/:id",
   // requireAuth,
   [],
   // validateRequest,
   async (req: Request, res: Response) => {
      const order = await Order.findById(req.params.id);

      if (!order) {
         throw new NotFoundError();
      }

      order.set({
         id: req.params.id,
         delivery_date: req.body.delivery_date,
         version: req.body.version,
         payment_made: req.body.payment_made,
         payment_date: req.body.payment_date,
         is_delivery: req.body.is_delivery,
         driver_paid: req.body.driver_paid,
         warehouse_paid: req.body.warehouse_paid,
         customer_id: req.body.customer_id,
         chow_id: req.body.chow_id,
      });
      await order.save();

      new OrderUpdatedPublisher(natsWrapper.client).publish({
         id: order.id,
         delivery_date: order.delivery_date,
         version: order.version,
         payment_made: order.payment_made,
         payment_date: order.payment_date,
         is_delivery: order.is_delivery,
         driver_paid: order.driver_paid,
         warehouse_paid: order.warehouse_paid,
         customer_id: order.customer_id,
         chow_id: order.chow_id,
      });

      res.send(order);
   }
);

export { router as updateOrderRouter };
