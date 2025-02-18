import mongoose, { Schema, ObjectId } from "mongoose";

const billOfLadingSchema = new mongoose.Schema(
  {
  billOfLandingNumber:{type:String},
  portOfLoading: {type:String},
  portOfDischarge: {type:String},
  dateIssued: {type:String},
  consignee:{type:String},
  insurance: {type:String},
  shipping: {type:String},
  client:{type:String},
  vessleName:{type:String},
  placeOfDelivery:{type:String},
  releasedDate:{type:String}
  },
  { timestamps: true }
);

const BillOfLading =
  mongoose.models.BillOfLading ||
  mongoose.model("BillOfLading", billOfLadingSchema);
export default BillOfLading;
