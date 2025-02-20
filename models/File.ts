import mongoose, { Schema, ObjectId } from "mongoose";

const billOfLadingSchema = new mongoose.Schema(
  {
    billOfLandingNumber: { type: String },
    portOfLoading: { type: String },
    portOfDischarge: { type: String },
    dateArrived: { type: String },
    consignee: { type: Schema.Types.ObjectId, ref: "Client" },
    notifyParty: { type: Schema.Types.ObjectId, ref: "Client" },
    insurance: { type: String },
    shipping: { type: String },
    client: { type: Schema.Types.ObjectId, ref: "Client" },
    shipper: { type: Schema.Types.ObjectId, ref: "Client" },
    vessleName: { type: String },
    placeOfDelivery: { type: String },
    releasedDate: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models?.BillOfLanding ||
  mongoose.model("BillOfLanding", billOfLadingSchema);
