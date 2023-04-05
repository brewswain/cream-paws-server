import { SubjectsEnum } from "@cream-paws-util/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderDoc } from "./order";

interface CustomerAttrs {
   name: string;
   // pets?: string[];
   pets?: [{ name: string; breed: string }];
   orders?: OrderDoc[];
}

interface CustomerDoc extends mongoose.Document {
   name: string;
   pets?: [{ name: string; breed: string }];
   version: number;
   orders?: OrderDoc[];
}

export interface CustomerUpdatedEvent {
   subject: SubjectsEnum.CustomerUpdated;
   data: {
      id: string;
      version: number;
      name: string;
      pets?: [
         {
            name: string;
            breed: string;
         }
      ];
      orders?: [
         {
            id: string;
            version: number;
            delivery_date: string;
            payment_made: boolean;
            payment_date: string;
            is_delivery: boolean;
            driver_paid: boolean;
            warehouse_paid: boolean;
            customer_id: string;
            chow_id?: string;
            chow_details?: {
               id: string;
               brand: string;
               target_group: string;
               flavour: string;
               size: number;
               unit: string;
               quantity: number;
               wholesale_price: number;
               retail_price: number;
               is_paid_for: boolean;
            };
         }
      ];
   };
}

interface CustomerModel extends mongoose.Model<CustomerDoc> {
   build(attrs: CustomerAttrs): CustomerDoc;

   findByEventVersion(event: {
      id: string;
      version: number;
      orders?: [
         {
            id: string;
            version: number;
            delivery_date: string;
            payment_made: boolean;
            payment_date: string;
            is_delivery: boolean;
            driver_paid: boolean;
            warehouse_paid: boolean;
            customer_id: string;
            chow_id?: string;
            chow_details?: {
               id: string;
               brand: string;
               target_group: string;
               flavour: string;
               size: number;
               unit: string;
               quantity: number;
               wholesale_price: number;
               retail_price: number;
               is_paid_for: boolean;
            };
         }
      ];
   }): Promise<CustomerDoc | null>;
}

const customerSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      pets: [
         {
            name: {
               type: String,
            },
            breed: {
               type: String,
            },
         },
      ],
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
