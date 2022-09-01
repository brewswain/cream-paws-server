import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ChowAttrs {
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
}

export interface ChowDoc extends mongoose.Document {
   // We expect an ID here since it's being sent to us as an event
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
   version: number;
}

interface ChowModel extends mongoose.Model<ChowDoc> {
   build(attrs: ChowAttrs): ChowDoc;

   findByEventVersion(event: {
      id: string;
      version: number;
   }): Promise<ChowDoc | null>;
}

const chowSchema = new mongoose.Schema(
   {
      brand: { type: String, required: true },
      target_group: { type: String, required: true },
      flavour: { type: String, required: true },
      size: { type: Number, required: true },
      unit: { type: String, required: true },
      quantity: { type: Number, required: true },
      wholesale_price: { type: Number, required: true },
      retail_price: { type: Number, required: true },
      is_paid_for: { type: Boolean, required: true },
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

chowSchema.set("versionKey", "version");
chowSchema.plugin(updateIfCurrentPlugin);

chowSchema.statics.findByEventVersion = (event: {
   id: string;
   version: number;
}) => {
   return Chow.findOne({
      _id: event.id,
      version: event.version - 1,
   });
};

chowSchema.statics.build = (attrs: ChowAttrs) => {
   return new Chow({
      _id: attrs.id,
      brand: attrs.brand,
      target_group: attrs.target_group,
      flavour: attrs.flavour,
      size: attrs.size,
      unit: attrs.unit,
      quantity: attrs.quantity,
      wholesale_price: attrs.wholesale_price,
      retail_price: attrs.retail_price,
      is_paid_for: attrs.is_paid_for,
   });
};

const Chow = mongoose.model<ChowDoc, ChowModel>("Chow", chowSchema);

export { Chow };
