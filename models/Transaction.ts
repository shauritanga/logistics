import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface ITransaction extends Document {
  _id: string;
  client: ObjectId;
  transactionDate: Date;
  status: "pending" | "approved" | "rejected";
  amount: number;
  category: "payments" | "expenses";
  description: string;
}

const transactionSchema = new Schema<ITransaction>({
  transactionDate: { type: Date, default: Date.now },
  client: { type: Schema.Types.ObjectId, ref: "Client" },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  category: { type: String, enum: ["payments", "expenses"], required: true },
  description: { type: String },
});

export default mongoose.models?.Transaction ||
  mongoose.model<ITransaction>("Transaction", transactionSchema);
