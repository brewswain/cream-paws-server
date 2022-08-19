import mongoose from "mongoose";

interface ChowAttrs {}

interface ChowDoc extends mongoose.Document {}

interface ChowModel extends mongoose.Model<ChowDoc> {}

const chowSchema = new mongoose.Schema({});

chowSchema.statics.build = (attrs: ChowAttrs) => {};

const Chow = mongoose.model<ChowDoc, ChowModel>("Chow", chowSchema);

export { Chow };
