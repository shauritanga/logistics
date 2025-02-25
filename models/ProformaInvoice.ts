const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Proforma Invoice Schema
const proformaInvoiceSchema = new Schema(
  {
    proformaNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
      },
    },
    items: [
      {
        description: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],
    estimatedSubtotal: {
      type: Number,
      required: true,
    },
    tax: {
      rate: {
        type: Number,
        default: 0,
      },
      amount: {
        type: Number,
        default: 0,
      },
    },
    estimatedTotal: {
      type: Number,
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true, // When the proforma offer expires
    },
    status: {
      type: String,
      enum: ["draft", "sent", "accepted", "rejected", "expired"],
      default: "draft",
    },
    shippingTerms: {
      type: String, // e.g., FOB, CIF for international trade
      default: "Not specified",
    },
    validityPeriod: {
      type: String, // e.g., "Valid for 30 days"
      default: "Valid until expiry date",
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create the Proforma Invoice model
export default mongoose.models?.ProformaInvoice ||
  mongoose.model("ProformaInvoice", proformaInvoiceSchema);
