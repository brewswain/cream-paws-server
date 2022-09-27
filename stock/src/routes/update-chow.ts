import express, { Request, Response } from "express";
import {
   NotAuthorizedError,
   NotFoundError,
   requireAuth,
   validateRequest,
} from "@cream-paws-util/common";

import { Chow } from "../models/chow";
import { ChowUpdatedPublisher } from "../events/publishers/chow-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
   "/api/stock/:id",
   // requireAuth,
   [],
   // validateRequest,
   async (req: Request, res: Response) => {
      const chow = await Chow.findById(req.params.id);

      if (!chow) {
         throw new NotFoundError();
      }

      // TODO: create user role here -- if user not admin throw new notauthorized error

      chow.set({
         brand: chow.brand,
         target_group: req.body.target_group,
         flavour: req.body.flavour,
         size: req.body.size,
         unit: req.body.unit,
         quantity: req.body.quantity,
         wholesale_price: req.body.wholesale_price,
         retail_price: req.body.retail_price,
         is_paid_for: req.body.is_paid_for,
      });

      await chow.save();

      new ChowUpdatedPublisher(natsWrapper.client).publish({
         brand: chow.brand,
         target_group: chow.target_group,
         flavour: chow.flavour,
         size: chow.size,
         unit: chow.unit,
         quantity: chow.quantity,
         wholesale_price: chow.wholesale_price,
         retail_price: chow.retail_price,
         is_paid_for: chow.is_paid_for,
         version: chow.version,
         id: chow.id,
      });

      res.status(201).send(chow);
   }
);

export { router as updateChowRouter };
