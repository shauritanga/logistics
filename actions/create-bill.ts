"use server";

import dbConnect from "@/lib/mongodb";
import BillOfLading from "@/models/File";
import { ActionResponse, BillOfLandingData } from "@/types";
import { z } from "zod";

const billOfLandingSchema = z.object({
  billOfLandingNumber: z.string().min(1, "Bill of landing number is required"),
  portOfLoading: z.string().min(1, "Origin port is required"),
  portOfDischarge: z.string().min(1, "Destination port is required"),
  insurance: z.string().min(1, "Insurance company is required"),
  consignee: z.string().min(1, "Consignee is required"),
  dateIssued: z.string().min(1, "Issued date is required"),
  releasedDate: z.string().min(1, "Released date is required"),
  shipping: z.string().min(1, "Shipping name is required"),
  client: z.string().min(1, "Client name is required"),
  placeOfDelivery: z.string().min(1, "Final destination is required"),
  vessleName: z.string().min(1, "Vessle name is required"),
});

export default async function submitBill(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  await dbConnect();
  try {
    const rawData: BillOfLandingData = {
      billOfLandingNumber: formData.get("billOfLandingNumber") as string,
      consignee: formData.get("consignee") as string,
      portOfLoading: formData.get("portOfLoading") as string,
      portOfDischarge: formData.get("portOfDischarge") as string,
      dateIssued: formData.get("dateIssued") as string,
      insurance: formData.get("insurance") as string,
      shipping: formData.get("shipping") as string,
      client: formData.get("client") as string,
      placeOfDelivery: formData.get("placeOfDelivery") as string,
      vessleName: formData.get("vessleName") as string,
      releasedDate: formData.get("releasedDate") as string,
    };

    console.log({ rawData });

    const validatedData = billOfLandingSchema.safeParse(rawData);

    if (!validatedData.success) {
      console.log(validatedData.error.flatten().fieldErrors);
      return {
        success: false,
        message: "Please fix the errors in the form",
        errors: validatedData.error.flatten().fieldErrors,
        inputs: rawData,
      };
    }

    const bill = new BillOfLading(validatedData.data);
    await bill.save();
    return { success: true, message: "Bill of landing has been saved" };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      inputs: {},
    };
  }
}
