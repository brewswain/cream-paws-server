import express from "express";
// Please note that any time we use async, we need to use 'next' normally.
// To bypass this to make life easier for devs, we use the library: 'express-async-errors'
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import {
   NotFoundError,
   errorHandler,
   currentUserMiddleware,
} from "@cream-paws-util/common";
import { getAllChowRouter } from "./routes/get-all-chow";
import { createChowRouter } from "./routes/create-chow";
import { findChowRouter } from "./routes/find-chow";
import { updateChowRouter } from "./routes/update-chow";
import { deleteChowRouter } from "./routes/delete-chow";

export const app = express();
// Traffic is proxied to our app through ingress nginx so we need this setting
app.set("trust proxy", true);
app.use(json());
app.use(
   cookieSession({
      // disabling encryption since we're using a JWT which is natively encrypted
      // and this makes our approach more language agnostic
      signed: false,
      secure: true,
   })
);
app.use(currentUserMiddleware);

app.use(getAllChowRouter);
app.use(createChowRouter);
app.use(updateChowRouter);
app.use(deleteChowRouter);
app.use(findChowRouter);

// Looks for any requests that don't exist to throw our 404.
app.all("*", async () => {
   throw new NotFoundError();
});

app.use(errorHandler);
