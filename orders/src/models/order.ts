import mongoose from "mongoose";

interface OrderAttrs {
   quantity: number;
   delivery_date: string;
   payment_made: boolean;
   payment_date: string;
   is_delivery: boolean;
   driver_paid: boolean;
   warehouse_paid: boolean;
}

interface OrderDoc extends mongoose.Document {
   quantity: number;
   delivery_date: string;
   payment_made: boolean;
   payment_date: string;
   is_delivery: boolean;
   driver_paid: boolean;
   warehouse_paid: boolean;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
   build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
   {
      quantity: { type: Number, required: true },
      delivery_date: { type: String, required: true },
      payment_date: { type: String, required: true },
      payment_made: { type: Boolean, required: true },
      is_delivery: { type: Boolean, required: true },
      driver_paid: { type: Boolean, required: true },
      warehouse_paid: { type: Boolean, required: true },
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
