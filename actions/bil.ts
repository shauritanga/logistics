"use server";

import dbConnect from "@/lib/mongodb";
import BillOfLading from "@/models/File";
import { ActionResponse, BillOfLandingData, ResponseBill } from "@/types";
import { revalidatePath } from "next/cache";
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

export async function submitBill(
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
      dateArrived: formData.get("dateArrived") as string,
      insurance: formData.get("insurance") as string,
      shipper: formData.get("shipper") as string,
      notifyParty: formData.get("notifyParty") as string,
      shippingLine: formData.get("shippingLine") as string,
      client: formData.get("client") as string,
      placeOfDelivery: formData.get("placeOfDelivery") as string,
      vessleName: formData.get("vessleName") as string,
      releasedDate: formData.get("releasedDate") as string,
    };

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
    revalidatePath("/dashboard/manage-bill-of-landing");
    return { success: true, message: "Bill of landing has been saved" };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      inputs: {},
    };
  }
}

export async function getAllBilOfLanding(): Promise<ResponseBill[]> {
  try {
    await dbConnect();
    const BilOfLandings = await BillOfLading.find().populate([
      "client",
      "shipper",
      "consignee",
      "notifyParty",
    ]);

    console.log({ BilOfLandings });
    return JSON.parse(JSON.stringify(BilOfLandings, null, 2));
  } catch (error) {}
  return [];
}
