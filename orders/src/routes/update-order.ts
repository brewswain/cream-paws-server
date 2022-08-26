import express, { Request, Response } from "express";
import {
   NotFoundError,
   requireAuth,
   validateRequest,
} from "@cream-paws-util/common";
import { body } from "express-validator";
import { Order } from "../models/order";

const router = express.Router();

router.put(
   "/api/orders/:id",
   requireAuth,
   [],
   validateRequest,
   async (req: Request, res: Response) => {
      const order = await Order.findById(req.params.id);

      if (!order) {
         throw new NotFoundError();
      }

      order.set({
         name: req.body.name,
         pets: req.body.pets,
      });
      await order.save();

      res.send(order);
   }
);

export { router as updateOrderRouter };
