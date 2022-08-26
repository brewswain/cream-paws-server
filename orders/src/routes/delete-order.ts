import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@cream-paws-util/common";
import { Order } from "../models/order";

const router = express.Router();

router.delete(
   "/api/orders/:id",
   [requireAuth, validateRequest],
   async (req: Request, res: Response) => {
      await Order.deleteOne({
         id: req.params.id,
      });

      res.status(200).send(`Order id: ${req.params.id} successfully deleted.`);
   }
);

export { router as deleteOrderRouter };
