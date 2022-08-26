import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@cream-paws-util/common";
import { body } from "express-validator";
import { Chow } from "../models/chow";

const router = express.Router();

router.post(
   "/api/stock",
   requireAuth,
   [],
   validateRequest,
   async (req: Request, res: Response) => {
      const {
         brand,
         target_group,
         flavour,
         size,
         unit,
         quantity,
         wholesale_price,
         retail_price,
         is_paid_for,
      } = req.body;
      const chow = Chow.build({
         brand,
         target_group,
         flavour,
         size,
         unit,
         quantity,
         wholesale_price,
         retail_price,
         is_paid_for,
      });

      await chow.save();

      res.status(201).send(chow);
   }
);

export { router as createChowRouter };
