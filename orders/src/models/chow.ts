import mongoose from "mongoose";

interface ChowAttrs {
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

interface ChowModel extends mongoose.Model<ChowDoc> {
   build(attrs: ChowAttrs): ChowDoc;
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

chowSchema.statics.build = (attrs: ChowAttrs) => {
   return new Chow(attrs);
};

const Chow = mongoose.model<ChowDoc, ChowModel>("Chow", chowSchema);

export { Chow };