import mongoose, { Schema, Document } from "mongoose";

export interface IFile extends Document {
  _id: string;
}

const fileSchema = new Schema<IFile>({});

export default mongoose.models?.File ||
  mongoose.model<IFile>("File", fileSchema);
