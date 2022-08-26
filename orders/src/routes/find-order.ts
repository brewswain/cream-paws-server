import express, { Request, Response } from "express";
import {
   NotFoundError,
   requireAuth,
   validateRequest,
} from "@cream-paws-util/common";
import { Order } from "../models/order";

const router = express.Router();

router.get(
   "/api/orders/:id",
   [requireAuth, validateRequest],
   async (req: Request, res: Response) => {
      const order = await Order.findById(req.params.id);

      if (!order) {
         throw new NotFoundError();
      }

      res.send(order);
   }
);

export { router as findOrderRouter };
