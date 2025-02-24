import mongoose, { Schema } from "mongoose";

const billOfLadingSchema = new mongoose.Schema(
  {
    bolNumber: { type: String },
    countryLastConsignment: { type: String },
    countryOfExeport: { type: String },
    entryOffice: { type: String },
    containers: [
      {
        containerNumber: { type: String, required: true },
        tareWeight: { type: Number, required: true },
        grossWeight: { type: Number, required: true },
      },
    ],
    goods: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        weight: { type: Number, required: true },
        value: { type: Number },
        containerReference: { type: String },
      },
    ],
    freightCharges: {
      amount: { type: Number, required: true },
      currency: { type: String, default: "USD" },
    },
    insurance: {
      amount: { type: Number, required: true },
      currency: { type: String, default: "USD" },
    },
    term: { code: String, place: String },
    tansad: { number: String, date: Date },
    portOfLoading: { type: String, required: true },
    portOfDischarge: { type: String, required: true },
    deliveryPlace: { type: String },
    arrivalDate: { type: Date },
    releasedDate: { type: String },
    shipper: { type: Schema.Types.ObjectId, ref: "Client" },
    notifyParty: { type: Schema.Types.ObjectId, ref: "Client" },
    client: { type: Schema.Types.ObjectId, ref: "Client" },
    consignee: { type: Schema.Types.ObjectId, ref: "Client" },
    shippingLine: { type: String },
    shippingOrder: { type: String },
    tradingCountry: { type: String },
    vessleName: { type: String },
    packingList: {
      totalPackages: Number,
      totalNetWeight: Number,
      totalGrossWeight: Number,
      totalVolume: Number,
      file: { type: Schema.Types.Mixed, default: null },
    },
    portInvoice: {
      invoiceNumber: String,
      amount: Number,
      currency: String,
      date: Date,
      file: { type: Schema.Types.Mixed, default: null },
    },
  },
  { timestamps: true }
);

export default mongoose.models?.BillOfLanding ||
  mongoose.model("BillOfLanding", billOfLadingSchema);
