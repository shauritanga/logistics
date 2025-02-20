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
