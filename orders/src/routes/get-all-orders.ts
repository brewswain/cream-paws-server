import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@cream-paws-util/common";
import { body } from "express-validator";
import { Order } from "../models/order";

const router = express.Router();

router.get(
   "/api/orders",
   [requireAuth, validateRequest],
   async (req: Request, res: Response) => {
      const orders = await Order.find({});

      res.send(orders);
   }
);

export { router as getAllOrdersRouter };
