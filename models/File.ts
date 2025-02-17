import mongoose, { Schema, ObjectId } from "mongoose";

const containerSchema = new mongoose.Schema({
  containerNumber: { type: String, required: true },
  sealNumber: { type: String, required: true },
  descriptionOfGoods: {
    quantity: { type: Number, required: true },
    weight: {
      gross: { type: Number, required: true },
      net: { type: Number, required: true },
    },
    dimensions: { type: String },
    marksAndNumbers: { type: String },
    natureOfGoods: { type: String, required: true },
  },
});

const billOfLadingSchema = new mongoose.Schema(
  {
    billOfLadingNumber: { type: String, required: true, unique: true },
    containers: [containerSchema],
    portOfLoading: { type: String, required: true },
    portOfDischarge: { type: String, required: true },
    placeOfDelivery: { type: String, required: true },
    freight: { type: Number, required: true },
    insurance: { type: String },
  },
  { timestamps: true }
);

const BillOfLading =
  mongoose.models.BillOfLading ||
  mongoose.model("BillOfLading", billOfLadingSchema);
export default BillOfLading;
