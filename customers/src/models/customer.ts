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

   findByEventVersion(event: {
      id: string;
      version: number;
   }): Promise<CustomerDoc | null>;
}

const customerSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      pets: [{ type: String }],
      // Types.Mixed here prevents only our orderID from being set when we're creating new
      // order and embedding it onto our customer.
      orders: [
         {
            type: mongoose.Schema.Types.Mixed,
            ref: "Order",
         },
      ],
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

customerSchema.statics.findByEventVersion = (event: {
   id: string;
   version: number;
}) => {
   return Customer.findOne({
      _id: event.id,
      version: event.version - 1,
   });
};

customerSchema.statics.build = (attrs: CustomerAttrs) => {
   return new Customer(attrs);
};

const Customer = mongoose.model<CustomerDoc, CustomerModel>(
   "Customer",
   customerSchema
);

export { Customer };
