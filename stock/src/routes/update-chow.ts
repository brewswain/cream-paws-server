import express, { Request, Response } from "express";
import {
   NotAuthorizedError,
   NotFoundError,
   requireAuth,
   validateRequest,
} from "@cream-paws-util/common";
import { Chow } from "../models/chow";

const router = express.Router();

router.put(
   "/api/stock/:id",
   requireAuth,
   [],
   validateRequest,
   async (req: Request, res: Response) => {
      const chow = await Chow.findById(req.params.id);

      if (!chow) {
         throw new NotFoundError();
      }

      // TODO: create user role here -- if user not admin throw new notauthorized error

      chow.set({
         brand: req.body.brand,
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

      res.send(chow);
   }
);

export { router as updateChowRouter };
