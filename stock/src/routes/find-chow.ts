import express, { Request, Response } from "express";
import { NotFoundError } from "@cream-paws-util/common";
import { Chow } from "../models/chow";

const router = express.Router();

router.get("/api/stock/:id", async (req: Request, res: Response) => {
   const chow = await Chow.findById(req.params.id);

   if (!chow) {
      throw new NotFoundError();
   }
   res.send(chow);
});

export { router as findChowRouter };
