import mongoose, { Schema, Document, Types } from "mongoose";

// Interfaces remain the same
interface IInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface ITax {
  rate: number;
  amount: number;
}

interface IDiscount {
  rate?: number;
  amount?: number;
}

export interface IInvoice extends Document {
  _id: string;
  invoiceNumber: string;
  client: Types.ObjectId;
  items: IInvoiceItem[];
  subtotal: number;
  tax: ITax;
  discount: IDiscount;
  totalAmount: number;
  issueDate: Date;
  dueDate: Date;
  status: "draft" | "sent" | "paid" | "overdue" | "canceled";
  paymentTerms: string;
  notes?: string;
}

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: {
      type: String,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Client reference is required"],
      index: true,
    },
    items: [
      {
        description: {
          type: String,
          required: [true, "Item description is required"],
          trim: true,
          minlength: [2, "Description must be at least 2 characters"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
          validate: {
            validator: Number.isInteger,
            message: "Quantity must be an integer",
          },
        },
        unitPrice: {
          type: Number,
          required: [true, "Unit price is required"],
          min: [0, "Unit price cannot be negative"],
          validate: {
            validator: (v: number) => Number(v.toFixed(2)) === v,
            message: "Unit price must have at most 2 decimal places",
          },
        },
        total: {
          type: Number,
          // required: [true, "Item total is required"],
          min: [0, "Item total cannot be negative"],
        },
      },
    ],
    subtotal: {
      type: Number,
      // required: [true, "Subtotal is required"],
      min: [0, "Subtotal cannot be negative"],
    },
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
    totalAmount: {
      type: Number,
      // required: [true, "Total amount is required"],
      min: [0, "Total cannot be negative"],
    },
    issueDate: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
      validate: {
        validator: function (v: Date) {
          return v > this.issueDate;
        },
        message: "Due date must be after issue date",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["draft", "sent", "paid", "overdue", "canceled"],
        message: "{VALUE} is not a valid status",
      },
      default: "draft",
      index: true,
    },
    paymentTerms: {
      type: String,
      default: "Due upon receipt",
      trim: true,
      enum: {
        values: ["Due upon receipt", "Net 15", "Net 30", "Net 60"],
        message: "{VALUE} is not a valid payment term",
      },
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for invoice number generation
// invoiceSchema.index({ invoiceNumber: 1 }, { unique: true });
invoiceSchema.index({ dueDate: 1, status: 1 });

// Virtual for days until due
invoiceSchema.virtual("daysUntilDue").get(function () {
  const diff = this.dueDate.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 3600 * 24));
});

// Generate invoice number
async function generateInvoiceNumber(): Promise<string> {
  const date = new Date();
  const dateString = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD

  // Find the last invoice for today to get the sequence
  const lastInvoice = await mongoose.models.Invoice.findOne({
    invoiceNumber: { $regex: `^INV-${dateString}` },
  }).sort({ invoiceNumber: -1 });

  let sequence = 1;
  if (lastInvoice) {
    const lastSequence = parseInt(lastInvoice.invoiceNumber.slice(-4));
    sequence = lastSequence + 1;
  }

  const sequenceString = sequence.toString().padStart(4, "0");
  return `INV-${dateString}-${sequenceString}`;
}

// Pre-save middleware with invoice number generation
invoiceSchema.pre("save", async function (next) {
  console.log("Pre-save triggered for:", this._id);
  console.log("Is new document?", this.isNew);
  console.log("Input data:", JSON.stringify(this.toObject(), null, 2));
  console.log("++++++++++++++++++++++++++++++++++++++++++++++");
  if (this.isNew && !this.invoiceNumber) {
    this.invoiceNumber = await generateInvoiceNumber();
  }

  // Calculate item totals
  this.items.forEach((item) => {
    item.total = Number((item.quantity * item.unitPrice).toFixed(2));
  });

  // Calculate subtotal
  this.subtotal = Number(
    this.items.reduce((sum, item) => sum + item.total, 0).toFixed(2)
  );

  // Calculate tax amount
  this.tax.amount = Number(((this.subtotal * this.tax.rate) / 100).toFixed(2));

  // Calculate discount amount if rate is provided
  if (this.discount.rate) {
    this.discount.amount = Number(
      ((this.subtotal * this.discount.rate) / 100).toFixed(2)
    );
  }

  // Calculate total amount
  this.totalAmount = Number(
    (this.subtotal + this.tax.amount - (this.discount.amount || 0)).toFixed(2)
  );

  next();
});

// Pre-validate middleware
invoiceSchema.pre("validate", function (next) {
  if (this.isNew && this.issueDate > this.dueDate) {
    this.invalidate(
      "dueDate",
      "Due date must be after issue date",
      this.dueDate
    );
  }

  if (this.discount.rate && this.discount.amount) {
    this.invalidate(
      "discount",
      "Provide either discount rate or amount, not both",
      this.discount
    );
  }

  next();
});

// Static methods
invoiceSchema.statics.findOverdue = function () {
  return this.find({
    status: { $in: ["sent", "draft"] },
    dueDate: { $lt: new Date() },
  });
};

// Virtual for days until due
invoiceSchema.virtual("daysUntilDue").get(function () {
  const diff = this.dueDate.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 3600 * 24));
});

// Instance method to mark as paid
invoiceSchema.methods.markAsPaid = async function () {
  this.status = "paid";
  return this.save();
};

// Instance method to mark as sent
invoiceSchema.methods.markAsSent = async function () {
  this.status = "sent";
  return this.save();
};
// Instance method to mark as paid
invoiceSchema.methods.markAsPaid = async function () {
  this.status = "paid";
  return this.save();
};

// Instance methods
invoiceSchema.methods.applyDiscount = async function (
  rateOrAmount: number,
  isRate: boolean = true
) {
  if (isRate) {
    this.discount.rate = rateOrAmount;
    this.discount.amount = 0;
  } else {
    this.discount.amount = rateOrAmount;
    this.discount.rate = 0;
  }
  return this.save();
};

invoiceSchema.set("toJSON", { virtuals: true });
invoiceSchema.set("toObject", { virtuals: true });

export default mongoose.models?.Invoice ||
  mongoose.model<IInvoice>("Invoice", invoiceSchema);
