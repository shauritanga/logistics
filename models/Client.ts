import mongoose, { Schema, Document } from "mongoose";

export interface IClient extends Document {
  _id: string;
  name: string;
  district: string;
  region: string;
  streetAddress: string;
  country: string;
  email: string;
  tin: string;
  vat: string;
  phone: string;
}

const clientSchema = new Schema<IClient>({
  email: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  district: { type: String, required: true },
  region: { type: String, required: true },
  phone: { type: String },
  streetAddress: { type: String },
  tin: { type: String, unique: true },
  vat: { type: String, unique: true },
  country: { type: String },
});

export default mongoose.models?.Client ||
  mongoose.model<IClient>("Client", clientSchema);
