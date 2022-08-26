import express, { Request, Response } from "express";
import {
   NotFoundError,
   requireAuth,
   validateRequest,
} from "@cream-paws-util/common";
import { Customer } from "../models/customer";

const router = express.Router();

router.delete(
   "/api/customer/:id",
   [requireAuth, validateRequest],
   async (req: Request, res: Response) => {
      await Customer.deleteOne({
         id: req.params.id,
      });

      res.status(200).send(
         `Customer id: ${req.params.id} successfully deleted.`
      );
   }
);

export { router as deleteCustomerRouter };
