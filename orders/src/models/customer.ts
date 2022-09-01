import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface CustomerAttrs {
   id: string;
   name: string;
   pets?: string[];
}

export interface CustomerDoc extends mongoose.Document {
   name: string;
   pets?: string[];
   version: number;
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
      pets: [{ type: String, required: false }],
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
   return new Customer({
      _id: attrs.id,
      name: attrs.name,
      pets: attrs.pets,
   });
};

const Customer = mongoose.model<CustomerDoc, CustomerModel>(
   "Customer",
   customerSchema
);

export { Customer };
