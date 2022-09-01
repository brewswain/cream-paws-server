import express, { Request, Response } from "express";
import {
   NotFoundError,
   requireAuth,
   validateRequest,
} from "@cream-paws-util/common";
import { Order } from "../models/order";
import { OrderDeletedPublisher } from "../events/publishers/order-deleted-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
   "/api/orders/:id",
   [requireAuth, validateRequest],
   async (req: Request, res: Response) => {
      const { id } = req.params;

      const order = await Order.findById(id);

      if (!order) {
         throw new NotFoundError();
      }

      await Order.deleteOne({
         id,
      });

      new OrderDeletedPublisher(natsWrapper.client).publish({
         id,
         customerId: order.customer_id,
         version: order.version,
      });

      res.status(200).send(`Order id: ${req.params.id} successfully deleted.`);
   }
);

export { router as deleteOrderRouter };
