import { Client } from "@/app/dashboard/clients/components/ClientTable";

export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>; // Store field-specific errors
  inputs?: any; // Include the original input if need
};

export type BillOfLandingData = {
  billOfLandingNumber: string;
  portOfLoading: string;
  portOfDischarge: string;
  dateArrived: string;
  consignee: string;
  insurance: string;
  shippingLine: string;
  notifyParty: string;
  shipper: string;
  client: string;
  vessleName: string;
  placeOfDelivery: string;
  releasedDate: string;
};

export type ResponseBill = {
  _id: string;
  billOfLadingNumber: string;
  shippingLine: string;
  shipper: string;
  consignee: string;
  dateArrived: Date;
  notifyParty: string;
  insurance: string;
  client: string;
  vessleName: string;
  placeOfDelivery: string;
  portOfLoading: string;
  portOfDischarge: string;
  createdAt: Date;
  updatedAt: Date;
  releasedDate: string;
};

export interface Quotation {
  _id: string;
  quotationNumber: string;
  client: string;
  issuedDate: string; // ISO date string (e.g., "2025-02-21")
  validUntil: string; // ISO date string
  status: "pending" | "accepted" | "rejected" | "expired";
  services: {
    clearing: {
      enabled: boolean;
      customsFees: number;
      dutiesAndTaxes: number;
      agentFees: number;
      additionalCharges?: { description: string; amount: number }[];
    };
    forwarding: {
      enabled: boolean;
      freightCharges: number;
      surcharges?: { type: string; amount: number }[];
      originCharges: number;
      destinationCharges: number;
      transitTime?: string;
      incoterms: "FOB" | "CIF" | "DDP" | "EXW";
    };
    logistics: {
      enabled: boolean;
      transportation: { mode: "air" | "sea" | "road" | "rail"; cost: number }[];
      warehousing: { enabled: boolean; duration?: number; cost: number };
      insurance: { enabled: boolean; coverageAmount?: number; cost: number };
      lastMileDelivery: number;
    };
  };
  cargoDetails: {
    description: string;
    weight: number;
    volume?: number;
    dimensions?: { length?: number; width?: number; height?: number };
    hazardous: boolean;
  };
  origin: string;
  destination: string;
  totalCost: number;
  notes?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export type Invoice = {
  _id: string;
  invoiceNumber: string;
  client: Client;
  items: [
    {
      description: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }
  ];
  subtotal: number;
  tax: { rate: number; amount: number };
  discount: { rate: number; amount: number };
  totalAmount: number;
  issueDate: Date;
  dueDate: Date;
  status: string;
  paymentTerms: string;
  notes: string;
};
