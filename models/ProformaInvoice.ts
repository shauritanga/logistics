import mongoose, { Schema, Document, ObjectId } from "mongoose";

// Define the Proforma Invoice Interface
export interface IProformaInvoice extends Document {
  _id: string;
  proformaNumber: string;
  client: ObjectId;
  bol: any;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  estimatedSubtotal: number;
  tax: {
    rate: number;
    amount: number;
  };
  estimatedTotal: number;
  issueDate: Date;
  expiryDate: Date;
  status: "draft" | "sent" | "accepted" | "rejected" | "expired";
  shippingTerms: string;
  validityPeriod: string;
  notes?: string;
}

// Define the Proforma Invoice Schema
const proformaInvoiceSchema = new Schema<IProformaInvoice>(
  {
    proformaNumber: {
      type: String,
      required: true,
      unique: true,
    },
    client: { type: Schema.Types.ObjectId, ref: "Client" },
    bol: { type: Schema.Types.ObjectId, ref: "BillOfLanding" },
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
      required: true,
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
  mongoose.model<IProformaInvoice>("ProformaInvoice", proformaInvoiceSchema);
