import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

enum ChowTargetGroup {
   Puppy = "Puppy",
   Small_Breed = "Small Breed",
   Canine = "Canine",
   Feline = "Feline",
}

// TODO: Find a way to modify enum programmatically so that when user adds
// brand new chow, it doesn't break shit -- So far I'm thinking shift this enum to frontend
enum ChowLine {
   Pacific_Stream = "Pacific Stream (Smoked Salmon)",
   High_Prairie = "High Prairie (Venison & Bison)",
   Appalachian_Valley = "Appalachian Valley (Venison & Garbanzo Beans)",
   Wetlands = "Wetlands (Roasted Fowl)",
   Sierra_Mountain = "Sierra Mountain (Roasted Lamb)",
   Southwest_Canyon = "Southwest Canyon (Wild Boar)",
   Rocky_Mountain = "Rocky Mountain (Venison & Smoked Salmon)",
   Canyon_River = "Canyon River (Trout & Smoked Salmon)",
   Lowland_Creek = "Lowland Creek (Roasted Quail & Roasted Duck)",
   Maintenance = "Maintenance",
   Pro_89 = "PRO 89",
   Puppy = "Puppy",
   Performance = "Performance",
   Lamb_Rice = "Lamb & Rice",
}

enum ChowUnit {
   Kilogram = "kg",
   Pound = "lb",
   Ounce = "oz",
}
interface ChowAttrs {
   brand: string;
   target_group: string;
   flavour: string;
   size: number;
   unit: string;
   wholesale_price: number;
   retail_price: number;
   is_paid_for: boolean;
}

interface ChowDoc extends mongoose.Document {
   brand: string;
   target_group: string;
   flavour: string;
   size: number;
   unit: string;
   wholesale_price: number;
   retail_price: number;
   is_paid_for: boolean;
   version: number;
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

chowSchema.statics.build = (attrs: ChowAttrs) => {
   return new Chow(attrs);
};

const Chow = mongoose.model<ChowDoc, ChowModel>("Chow", chowSchema);

export { Chow };
