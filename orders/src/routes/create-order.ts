import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@cream-paws-util/common";
import { body } from "express-validator";
import { Order } from "../models/order";

const router = express.Router();

router.post(
   "/api/orders",
   requireAuth,
   [],
   validateRequest,
   async (req: Request, res: Response) => {
      const {
         quantity,
         delivery_date,
         payment_made,
         payment_date,
         is_delivery,
         driver_paid,
         warehouse_paid,
      } = req.body;

      const order = Order.build({
         quantity,
         delivery_date,
         payment_made,
         payment_date,
         is_delivery,
         driver_paid,
         warehouse_paid,
      });

      await order.save();
      res.status(201).send(order);
   }
);

export { router as createOrderRouter };
