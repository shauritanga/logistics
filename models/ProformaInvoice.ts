import mongoose, { Schema, Document } from "mongoose";
import * as AutoIncrement from "mongoose-sequence"; // Correct import

const AutoInc = (AutoIncrement as any)(mongoose); // Initialize with mongoose instance

// Define the Proforma Invoice Interface
export interface IProformaInvoice extends Document {
  _id: mongoose.Types.ObjectId;
  proformaNumber: String;
  client: mongoose.Types.ObjectId;
  bol: mongoose.Types.ObjectId;
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
      type: Number,
      unique: true,
    },
    client: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    bol: { type: Schema.Types.ObjectId, ref: "BillOfLanding", required: true }, // Fixed typo
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
      type: String,
      default: "Not specified",
    },
    validityPeriod: {
      type: String,
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

// Auto-increment proformaNumber instead of _id
proformaInvoiceSchema.plugin(AutoInc, {
  id: "proformaInvoice_seq",
  inc_field: "proformaNumber", // Use proformaNumber for incrementing
  start_seq: 1,
  transform: (num: number) => `PROF${String(num).padStart(4, "0")}`,
});

proformaInvoiceSchema.virtual("formattedProformaNumber").get(function () {
  return `PROF${String(this.proformaNumber).padStart(4, "0")}`;
});

// Pre-save hook to calculate totals (optional improvement)
// proformaInvoiceSchema.pre("save", function (next) {
//   this.items.forEach((item) => {
//     item.total = item.quantity * item.unitPrice;
//   });
//   this.estimatedSubtotal = this.items.reduce(
//     (sum, item) => sum + item.total,
//     0
//   );
//   this.tax.amount = (this.tax.rate / 100) * this.estimatedSubtotal;
//   this.estimatedTotal = this.estimatedSubtotal + this.tax.amount;
//   next();
// });

// Enable virtuals when converting to JSON or objects (optional but recommended)
proformaInvoiceSchema.set("toJSON", { virtuals: true });
proformaInvoiceSchema.set("toObject", { virtuals: true });
// Create the Proforma Invoice model
export default mongoose.models?.ProformaInvoice ||
  mongoose.model<IProformaInvoice>("ProformaInvoice", proformaInvoiceSchema);
