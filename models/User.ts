import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
});

export default mongoose.models?.User ||
  mongoose.model<IUser>("User", userSchema);
