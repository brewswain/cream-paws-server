import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { User } from "../models/user";

import { BadRequestError, validateRequest } from "@cream-paws-util/common";

import { PasswordUtil } from "../utils/password-util";

const router = express.Router();

router.post(
   "/api/users/signin",
   [
      body("email").isEmail().withMessage("Email must be valid."),
      body("password")
         .trim()
         .notEmpty()
         .withMessage("You must supply a password."),
   ],
   validateRequest,

   async (req: Request, res: Response) => {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
         throw new BadRequestError("Invalid credentials");
      }

      const passwordsMatch = await PasswordUtil.compare(
         existingUser.password,
         password
      );
      // We repeat the logic here instead of just extracting our logic and doing:
      // if (!existingUser || !passwordsMatch)
      // Because without our previous check for existingUser, TS will yell at us that
      // existingUser.password in our compare() argument might be null
      if (!passwordsMatch) {
         throw new BadRequestError("Invalid credentials");
      }

      const userJwt = jwt.sign(
         {
            id: existingUser.id,
            email: existingUser.email,
         },

         process.env.JWT_KEY!
      );

      req.session = {
         jwt: userJwt,
      };

      req.session.jwt = userJwt;

      res.status(201).send(existingUser);
   }
);

export { router as signInRouter };
