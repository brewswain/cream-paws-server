import express, { Request, Response } from "express";
import {
   NotFoundError,
   requireAuth,
   validateRequest,
} from "@cream-paws-util/common";

import { natsWrapper } from "../nats-wrapper";
import { Chow } from "../models/chow";
import { ChowDeletedPublisher } from "../events/publishers/chow-deleted-publisher";

const router = express.Router();

router.delete(
   "/api/stock/:id",
   // [requireAuth, validateRequest],
   async (req: Request, res: Response) => {
      const { id } = req.params;

      const chow = await Chow.findById(req.params.id);

      if (!chow) {
         throw new NotFoundError();
      }

      await Chow.deleteOne({
         id,
      });

      new ChowDeletedPublisher(natsWrapper.client).publish({
         id,
         version: chow.version,
      });

      res.status(200).send(`Chow id: ${req.params.id} successfully deleted.`);
   }
);

export { router as deleteChowRouter };
