import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  position: string;
  phone: string;
  role: ObjectId;
}

const userSchema = new Schema<IUser>({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  position: { type: String },
  phone: { type: String },
  role: { type: String, required: true },
});

export default mongoose.models?.User ||
  mongoose.model<IUser>("User", userSchema);
