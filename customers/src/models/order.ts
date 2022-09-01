import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { ChowDoc } from "./chow";

interface OrderAttrs {
   id: string;
   delivery_date: string;
   payment_made: boolean;
   payment_date: string;
   is_delivery: boolean;
   driver_paid: boolean;
   warehouse_paid: boolean;
   customer_id: string;
   chow_being_ordered: ChowDoc;
}

export interface OrderDoc extends mongoose.Document {
   id: string;
   version: number;
   delivery_date: string;
   payment_made: boolean;
   payment_date: string;
   is_delivery: boolean;
   driver_paid: boolean;
   warehouse_paid: boolean;
   customer_id: string;
   chow_being_ordered: ChowDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
   build(attrs: OrderAttrs): OrderDoc;

   findByEventVersion(event: {
      id: string;
      version: number;
   }): Promise<OrderDoc | null>;
}

const orderSchema = new mongoose.Schema(
   {
      id: { type: String, required: true },
      delivery_date: { type: String, required: true },
      payment_date: { type: String, required: true },
      payment_made: { type: Boolean, required: true },
      is_delivery: { type: Boolean, required: true },
      driver_paid: { type: Boolean, required: true },
      warehouse_paid: { type: Boolean, required: true },
      customer_id: { type: String, required: true },

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
      driver_paid: attrs.driver_paid,
      warehouse_paid: attrs.warehouse_paid,
      _id: attrs.id,
      customer_id: attrs.customer_id,
      chow_being_ordered: attrs.chow_being_ordered,
   });
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
