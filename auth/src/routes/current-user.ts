import express, { Request, Response } from "express";

import { currentUserMiddleware } from "@cream-paws-util/common";

const router = express.Router();

router.get(
   "/api/users/currentuser",
   [currentUserMiddleware],
   (req: Request, res: Response) => {
      res.send({ currentUser: req.currentUser || null });
   }
);

export { router as currentUserRouter };
