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
import { createCustomerRouter } from "./routes/create-customer";
import { findCustomerRouter } from "./routes/find-customer";
import { getCustomersRouter } from "./routes/get-all-customers";
import { updateCustomerRouter } from "./routes/update-customer";
import { deleteCustomerRouter } from "./routes/delete-customer";

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

app.use(createCustomerRouter);
app.use(findCustomerRouter);
app.use(getCustomersRouter);
app.use(updateCustomerRouter);
app.use(deleteCustomerRouter);

// Looks for any requests that don't exist to throw our 404.
app.all("*", async () => {
   throw new NotFoundError();
});

app.use(errorHandler);
