import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { ChowDoc } from "./chow";

interface OrderAttrs {
   id: string;
   version: number;
   delivery_date: string;
   payment_made: boolean;
   payment_date: string;
   is_delivery: boolean;
   quantity: number;
   driver_paid: boolean;
   warehouse_paid: boolean;
   customer_id: string;
   chow_id?: string;
   chow_details?: ChowDoc;
}

export interface OrderDoc extends mongoose.Document {
   id: string;
   version: number;
   delivery_date: string;
   payment_made: boolean;
   payment_date: string;
   is_delivery: boolean;
   quantity: number;
   driver_paid: boolean;
   warehouse_paid: boolean;
   customer_id: string;
   chow_id?: string;
   chow_details?: ChowDoc;
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
      quantity: { type: Number, required: true },
      driver_paid: { type: Boolean, required: true },
      warehouse_paid: { type: Boolean, required: true },
      customer_id: { type: String, required: true },
      chow_id: { type: String },

      chow_details: {
         type: mongoose.Schema.Types.Mixed,
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

// orderSchema.set("versionKey", "version");
// orderSchema.plugin(updateIfCurrentPlugin);

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
   return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
