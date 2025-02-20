import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IClient extends Document {
  _id: string;
  name: string;
  district: string;
  region: string;
  street: string;
  country: string;
  email: string;
  phone: string;
}

const clientSchema = new Schema<IClient>({
  email: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  district: { type: String, required: true },
  region: { type: String, required: true },
  phone: { type: String },
  street: { type: String },
  country: { type: String },
});

export default mongoose.models?.Client ||
  mongoose.model<IClient>("Client", clientSchema);
