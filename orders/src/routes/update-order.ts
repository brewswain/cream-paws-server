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
   requireAuth,
   [],
   validateRequest,
   async (req: Request, res: Response) => {
      const order = await Order.findById(req.params.id).populate("chow");

      if (!order) {
         throw new NotFoundError();
      }

      order.set({
         name: req.body.name,
         pets: req.body.pets,
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
         chow_being_ordered: order.chow_being_ordered,
      });

      res.send(order);
   }
);

export { router as updateOrderRouter };
