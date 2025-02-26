"use server";

import dbConnect from "@/lib/mongodb";
import { uploadToCloudinary } from "@/lib/uploadFile";
import BillOfLanding, { IBillOfLading } from "@/models/BillOfLanding";
import { ResponseBill } from "@/types";
import { z } from "zod";

const billOfLandingSchema = z.object({
  billOfLandingNumber: z.string().min(1, "Bill of landing number is required"),
  portOfLoading: z.string().min(1, "Origin port is required"),
  portOfDischarge: z.string().min(1, "Destination port is required"),
  insurance: z.string().min(1, "Insurance company is required"),
  consignee: z.string().min(1, "Consignee is required"),
  notifyParty: z.string().min(1, "Notify party is required"),
  dateArrived: z.string().min(1, "Issued date is required"),
  releasedDate: z.string().min(1, "Released date is required"),
  shipper: z.string().min(1, "Shipper name is required"),
  shippingLine: z.string().min(1, "Shipping name is required"),
  client: z.string().min(1, "Client name is required"),
  placeOfDelivery: z.string().min(1, "Final destination is required"),
  vessleName: z.string().min(1, "Vessle name is required"),
});

// Simulated server action (replace with your actual server action)
export async function createBillOfLading(
  _: { success?: boolean; error?: string } | null,
  formData: any
): Promise<{ success?: boolean; error?: string }> {
  try {
    await dbConnect();

    const {
      bolNumber,
      shipper,
      consignee,
      notifyParty,
      client,
      countryLastConsignment,
      tradingCountry,
      entryOffice,
      countryOfExeport,
      shippingLine,
      shippingOrder,
      term,
      goods,
      containers,
      deliveryPlace,
      portOfLoading,
      portOfDischarge,
      arrivalDate,
      vessleName,
      releasedDate,
      freightCharges,
      tansad,
      insurance,
      packingList,
      portInvoice,
    } = formData;

    const packingListFileRef = await uploadToCloudinary(
      packingList.file,
      bolNumber,
      "packingList"
    );
    const portInvoiceFileRef = await uploadToCloudinary(
      portInvoice.file,
      bolNumber,
      "portInvoice"
    );

    const bolData = {
      bolNumber,
      countryLastConsigment: countryLastConsignment,
      countryOfExeport,
      entryOffice,
      containers: containers.map((container: any) => ({
        containerNumber: container.containerNumber,
        tareWeight: Number(container.tareWeight),
        grossWeight: Number(container.grossWeight),
      })),
      goods: goods.map((good: any) => ({
        description: good.description,
        quantity: Number(good.quantity),
        weight: Number(good.weight),
        value: Number(good.value),
        containerReference: good.containerReference,
      })),
      freightCharges: {
        amount: Number(freightCharges.amount),
        currency: freightCharges.currency,
      },
      insurance: {
        amount: Number(insurance.amount),
        currency: insurance.currency,
      },
      tansad: {
        number: tansad.number, // Adjusted to match your data
        date: new Date(tansad.date), // Assuming current date if not provided
      },
      portOfLoading,
      portOfDischarge,
      deliveryPlace,
      arrivalDate: new Date(arrivalDate),
      releasedDate: new Date(releasedDate),
      shipper: shipper,
      notifyParty: notifyParty,
      client: client,
      consignee: consignee,
      shippingLine,
      shippingOrder,
      term,
      tradingCountry,
      vessleName,
      packingList: {
        totalPackages: Number(packingList.totalPackages),
        totalNetWeight: Number(packingList.totalNetWeight),
        totalGrossWeight: Number(packingList.totalGrossWeight),
        totalVolume: Number(packingList.totalVolume),
        file: packingListFileRef || null,
      },
      portInvoice: {
        invoiceNumber: portInvoice.invoiceNumber,
        amount: Number(portInvoice.amount),
        currency: portInvoice.currency,
        date: new Date(portInvoice.date),
        file: portInvoiceFileRef || null,
      },
    };

    // Save to MongoDB
    const newBOL = new BillOfLanding(bolData);
    await newBOL.save();
    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: "Submission failed" };
  }
}

export async function getAllBilOfLanding(): Promise<IBillOfLading[] | []> {
  try {
    await dbConnect();
    const BilOfLandings = await BillOfLanding.find().populate([
      "client",
      "shipper",
      "consignee",
      "notifyParty",
    ]);

    return JSON.parse(JSON.stringify(BilOfLandings, null, 2));
  } catch (error) {}
  return [];
}
