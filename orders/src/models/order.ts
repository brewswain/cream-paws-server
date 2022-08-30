import mongoose from "mongoose";
import { ClassStaticBlockDeclaration } from "typescript";
import { ChowDoc } from "./chow";
import { CustomerDoc } from "./customer";

interface OrderAttrs {
   delivery_date: string;
   payment_made: boolean;
   payment_date: string;
   is_delivery: boolean;
   driver_paid: boolean;
   warehouse_paid: boolean;

   // Conceptual linking of our Order with a Customer and Stock.
   // Current thought is that we'll want a customer who'll be linked to this Order, as well as
   // the actual contents of said order. That being said, final vision might be Just Stock
   // linked here, and then Order becomes an optional parameter in our Customers service itself.
   customer: CustomerDoc;
   chow_being_ordered: ChowDoc;
}

interface OrderDoc extends mongoose.Document {
   delivery_date: string;
   payment_made: boolean;
   payment_date: string;
   is_delivery: boolean;
   driver_paid: boolean;
   warehouse_paid: boolean;
   customer: CustomerDoc;
   chow_being_ordered: ChowDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
   build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
   {
      delivery_date: { type: String, required: true },
      payment_date: { type: String, required: true },
      payment_made: { type: Boolean, required: true },
      is_delivery: { type: Boolean, required: true },
      driver_paid: { type: Boolean, required: true },
      warehouse_paid: { type: Boolean, required: true },

      // Setting up reference for our Customer and our stock
      customer: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Customer",
      },
      chow_being_ordered: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Chow",
      },
   },
   {
      toJSON: {
         transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
         },
      },
   }
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
   return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
