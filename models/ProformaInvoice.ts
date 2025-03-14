import mongoose, { Schema, Document } from "mongoose";

// Define the Proforma Invoice Interface
export interface IProformaInvoice extends Document {
  _id: mongoose.Types.ObjectId;
  proformaNumber: string;
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
  discount: {
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
        },
      },
    ],

    tax: {
      rate: {
        type: Number,
        default: 0,
        min: [0, "Tax rate cannot be negative"],
        max: [100, "Tax rate cannot exceed 100%"],
      },
      amount: {
        type: Number,
        default: 0,
        min: [0, "Tax amount cannot be negative"],
      },
    },
    discount: {
      rate: {
        type: Number,
        min: [0, "Discount rate cannot be negative"],
        max: [100, "Discount rate cannot exceed 100%"],
        default: 0,
      },
      amount: {
        type: Number,
        min: [0, "Discount amount cannot be negative"],
        default: 0,
      },
    },
    estimatedSubtotal: {
      type: Number,
      min: [0, "Subtotal cannot be negative"],
    },
    estimatedTotal: {
      type: Number,
      min: [0, "Total cannot be negative"],
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Generate invoice number
async function generateProformaNumber(): Promise<string> {
  const date = new Date();
  const dateString = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD

  // Find the last invoice for today to get the sequence
  const lastInvoice = await mongoose.models.ProformaInvoice.findOne({
    proformaNumber: { $regex: `^PRO-${dateString}` },
  }).sort({ proformaNumber: -1 });

  let sequence = 1;
  if (lastInvoice) {
    const lastSequence = parseInt(lastInvoice.proformaNumber.slice(-4));
    sequence = lastSequence + 1;
  }

  const sequenceString = sequence.toString().padStart(4, "0");
  return `PRO-${dateString}-${sequenceString}`;
}

proformaInvoiceSchema.pre("save", async function (next) {
  if (this.isNew && !this.proformaNumber) {
    this.proformaNumber = await generateProformaNumber();
  }

  if (this.isModified("items")) {
    this.items.forEach((item) => {
      item.total = item.quantity * item.unitPrice;
    });
    this.estimatedSubtotal = this.items.reduce(
      (sum, item) => sum + item.total,
      0
    );
  }

  if (this.isModified("tax.rate") || this.isModified("estimatedSubtotal")) {
    this.tax.amount = Number(
      ((this.tax.rate / 100) * this.estimatedSubtotal).toFixed(2)
    );
  }

  if (
    this.isModified("discount.rate") ||
    this.isModified("estimatedSubtotal")
  ) {
    this.discount.amount = Number(
      ((this.estimatedSubtotal * this.discount.rate) / 100).toFixed(2)
    );
  }

  if (
    this.isModified("estimatedSubtotal") ||
    this.isModified("tax.amount") ||
    this.isModified("discount.amount")
  ) {
    this.estimatedTotal = Number(
      (
        this.estimatedSubtotal +
        this.tax.amount -
        (this.discount.amount || 0)
      ).toFixed(2)
    );
  }

  next();
});

proformaInvoiceSchema.index({ proformaNumber: 1 }, { unique: true });
proformaInvoiceSchema.index({ client: 1 });
proformaInvoiceSchema.index({ bol: 1 });

// Create the Proforma Invoice model
export default mongoose.models?.ProformaInvoice ||
  mongoose.model<IProformaInvoice>("ProformaInvoice", proformaInvoiceSchema);
