import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IInvoice extends Document {
  _id: string;
  blNumber: ObjectId;
  entryNumber: string;
  invoiceDate: Date;
  totalExpense: Number;
  commission: Number;
  invoiceAmount: Number;
}

const invoiceSchema = new Schema<IInvoice>({
  blNumber: { type: Schema.Types.ObjectId, ref: "Bill" },
  entryNumber: { type: String },
  invoiceDate: { type: Date, default: Date.now },
  totalExpense: { type: Number },
  commission: { type: Number },
  invoiceAmount: { type: Number },
});

export default mongoose.models?.User ||
  mongoose.model<IInvoice>("Invoice", invoiceSchema);
