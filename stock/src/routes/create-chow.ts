import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@cream-paws-util/common";
import { body } from "express-validator";
import { Chow } from "../models/chow";
import { ChowCreatedPublisher } from "../events/publishers/chow-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
   "/api/stock",
   // requireAuth,
   [],
   // validateRequest,
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

      new ChowCreatedPublisher(natsWrapper.client).publish({
         id: chow.id,
         version: chow.version,
         brand: chow.brand,
         target_group: chow.target_group,
         flavour: chow.flavour,
         size: chow.size,
         unit: chow.unit,
         quantity: chow.quantity,
         wholesale_price: chow.wholesale_price,
         retail_price: chow.retail_price,
         is_paid_for: chow.is_paid_for,
      });

      res.status(201).send(chow);
   }
);

export { router as createChowRouter };
