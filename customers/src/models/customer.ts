import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderDoc } from "./order";

interface CustomerAttrs {
   name: string;
   pets?: string[];
   orders?: OrderDoc[];
}

interface CustomerDoc extends mongoose.Document {
   name: string;
   pets?: string[];
   version: number;
   orders?: OrderDoc[];
}

interface CustomerModel extends mongoose.Model<CustomerDoc> {
   build(attrs: CustomerAttrs): CustomerDoc;
}

const customerSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      pets: [{ type: String }],
      orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
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

customerSchema.set("versionKey", "version");
customerSchema.plugin(updateIfCurrentPlugin);

customerSchema.statics.build = (attrs: CustomerAttrs) => {
   return new Customer(attrs);
};

const Customer = mongoose.model<CustomerDoc, CustomerModel>(
   "Customer",
   customerSchema
);

export { Customer };
