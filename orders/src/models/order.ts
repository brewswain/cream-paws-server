import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { ChowDoc } from "./chow";
import { CustomerDoc } from "./customer";

interface OrderAttrs {
   delivery_date: string;
   payment_made: boolean;
   payment_date: string;
   is_delivery: boolean;
   quantity: number;
   driver_paid: boolean;
   warehouse_paid: boolean;

   // Conceptual linking of our Order with a Customer and Stock.
   // Current thought is that we'll want a customer who'll be linked to this Order, as well as
   // the actual contents of said order. That being said, final vision might be Just Stock
   // linked here, and then Order becomes an optional parameter in our Customers service itself.

   // The more I think about it, the more I think the latter makes more sense, but the former
   // allows us to have a cool list of orders used by people for data analysis?

   // TODO:
   // Actually, we can do it like this:
   // We make an order for a customer here.
   // The order service creates our order, populates our chow, and adds it to our customer here.
   // we then produce an Order:Added-To-Customer event, and emit an event with the customerId
   // or even just do a Customer:Edited event and send the entire payload over.
   // together along with either our data sent directly, or an OrderID with ticket population
   // added. The former is nice because this means that we don't have to have refs inside of
   // our customer service and logically gives us better flow. I'll comment out
   // implementations to see what suits us better

   // customer: CustomerDoc;
   customer_id: string;
   chow_id?: string;
   chow_details?: ChowDoc;
}

interface OrderDoc extends mongoose.Document {
   delivery_date: string;
   payment_made: boolean;
   payment_date: string;
   is_delivery: boolean;
   quantity: number;
   driver_paid: boolean;
   warehouse_paid: boolean;
   version: number;

   // customer: CustomerDoc;
   customer_id: string;
   chow_id?: string;
   chow_details?: ChowDoc;
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
      quantity: { type: Number, requires: true },
      driver_paid: { type: Boolean, required: true },
      warehouse_paid: { type: Boolean, required: true },

      // Setting up reference for our Customer and our stock
      // customer: {
      //    type: mongoose.Schema.Types.ObjectId,
      //    ref: "Customer",
      // },
      customer_id: { type: String, required: true },
      // chow_being_ordered: {
      //    type: mongoose.Schema.Types.ObjectId,
      //    ref: "Chow",
      // },
      chow_id: { type: String },
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.findByEventVersion = (event: {
   id: string;
   version: number;
}) => {
   return Order.findOne({
      _id: event.id,
      version: event.version - 1,
   });
};

orderSchema.statics.build = (attrs: OrderAttrs) => {
   return new Order({
      delivery_date: attrs.delivery_date,
      payment_made: attrs.payment_made,
      payment_date: attrs.payment_date,
      is_delivery: attrs.is_delivery,
      quantity: attrs.quantity,
      driver_paid: attrs.driver_paid,
      warehouse_paid: attrs.warehouse_paid,
      customer_id: attrs.customer_id,
      chow_id: attrs.chow_id,
   });
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
