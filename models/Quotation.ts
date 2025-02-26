import mongoose, { Schema } from "mongoose";

const QuotationSchema = new mongoose.Schema(
  {
    quotationNumber: {
      type: String,
      required: true,
      unique: true, // Unique identifier for the quotation (e.g., "QTN-2025-001")
    },
    client: { type: Schema.Types.ObjectId, ref: "Client" },
    bol: { type: Schema.Types.ObjectId, ref: "BillOfLanding" },
    issuedDate: {
      type: Date,
      default: Date.now, // Date the quotation was issued
    },
    validUntil: {
      type: Date,
      required: true, // Expiration date of the quotation
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "expired"],
      default: "pending", // Tracks the quotation’s lifecycle
    },
    services: {
      clearing: {
        enabled: { type: Boolean, default: false },
        customsFees: { type: Number, default: 0 }, // Customs clearance fees
        dutiesAndTaxes: { type: Number, default: 0 }, // Estimated duties/taxes
        agentFees: { type: Number, default: 0 }, // Clearing agent service fees
        additionalCharges: [
          {
            description: { type: String }, // e.g., "Inspection fee"
            amount: { type: Number, default: 0 },
          },
        ],
      },
      forwarding: {
        enabled: { type: Boolean, default: false },
        freightCharges: { type: Number, default: 0 }, // Base freight cost
        surcharges: [
          {
            type: { type: String }, // e.g., "BAF", "CAF"
            amount: { type: Number, default: 0 },
          },
        ],
        originCharges: { type: Number, default: 0 }, // Port/terminal fees at origin
        destinationCharges: { type: Number, default: 0 }, // Fees at destination
        transitTime: { type: String }, // e.g., "20 days"
        incoterms: {
          type: String,
          enum: ["FOB", "CIF", "DDP", "EXW"],
          default: "FOB",
        },
      },
      logistics: {
        enabled: { type: Boolean, default: false },
        transportation: [
          {
            mode: { type: String, enum: ["air", "sea", "road", "rail"] },
            cost: { type: Number, default: 0 },
          },
        ],
        warehousing: {
          enabled: { type: Boolean, default: false },
          duration: { type: Number }, // Days of storage
          cost: { type: Number, default: 0 },
        },
        insurance: {
          enabled: { type: Boolean, default: false },
          coverageAmount: { type: Number, default: 0 },
          cost: { type: Number, default: 0 },
        },
        lastMileDelivery: { type: Number, default: 0 }, // Final delivery cost
      },
    },
    cargoDetails: {
      description: { type: String, required: true }, // e.g., "Electronics"
      weight: { type: Number, required: true }, // In kilograms
      volume: { type: Number }, // In cubic meters (optional)
      dimensions: {
        length: { type: Number },
        width: { type: Number },
        height: { type: Number },
      },
      hazardous: { type: Boolean, default: false },
    },
    origin: {
      type: String,
      required: true, // e.g., "Shanghai, China"
    },
    destination: {
      type: String,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

// Virtual field to calculate total cost dynamically (optional)
QuotationSchema.virtual("calculatedTotalCost").get(function () {
  const clearingTotal =
    (this.services?.clearing?.customsFees || 0) +
    (this.services?.clearing?.dutiesAndTaxes || 0) +
    (this.services?.clearing?.agentFees || 0) +
    (this.services?.clearing?.additionalCharges?.reduce(
      (sum, charge) => sum + (charge.amount || 0),
      0
    ) || 0);

  const forwardingTotal =
    (this.services?.forwarding?.freightCharges || 0) +
    (this.services?.forwarding?.originCharges || 0) +
    (this.services?.forwarding?.destinationCharges || 0) +
    (this.services?.forwarding?.surcharges?.reduce(
      (sum, surcharge) => sum + (surcharge.amount || 0),
      0
    ) || 0);

  const logisticsTotal =
    (this.services?.logistics?.transportation?.reduce(
      (sum, t) => sum + (t.cost || 0),
      0
    ) || 0) +
    (this.services?.logistics?.warehousing?.cost || 0) +
    (this.services?.logistics?.insurance?.cost || 0) +
    (this.services?.logistics?.lastMileDelivery || 0);

  return clearingTotal + forwardingTotal + logisticsTotal;
});

// Ensure virtuals are included when converting to JSON
QuotationSchema.set("toJSON", { virtuals: true });

export default mongoose.models?.Quotation ||
  mongoose.model("Quotation", QuotationSchema);
