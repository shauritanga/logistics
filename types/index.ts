import { ZodError } from "zod";

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
  dateIssued: string;
  consignee: string;
  insurance: string;
  shipping: string;
};
