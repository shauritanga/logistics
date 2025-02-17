import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IImporter extends Document {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

const invoiceSchema = new Schema<IImporter>({
  name: { type: String },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
});

export default mongoose.models?.User ||
  mongoose.model<IImporter>("Invoice", invoiceSchema);
