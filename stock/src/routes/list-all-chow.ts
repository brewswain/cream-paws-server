import express, { Request, Response } from "express";

import { Chow } from "../models/chow";

const router = express.Router();

router.get("/api/stock", async (req: Request, res: Response) => {
   const chow = await Chow.find({});

   res.send(chow);
});

export { router as listAllChowRouter };
