"use server";

import dbConnect from "@/lib/mongodb";
import Quotation from "@/models/Quotation";
import { ActionResponse } from "@/types";

export async function createQuotation(
  formData: FormData
): Promise<ActionResponse> {
  try {
    await dbConnect();

    const quotationData = {
      quotationNumber: formData.get("quotationNumber"),
      client: formData.get("client"),
      validUntil: formData.get("validUntil")
        ? new Date(formData.get("validUntil") as string)
        : null,
      services: {
        clearing: {
          enabled: !!formData.get("customsFees"),
          customsFees: Number(formData.get("customsFees")) || 0,
        },
        forwarding: {
          enabled: !!formData.get("freightCharges"),
          freightCharges: Number(formData.get("freightCharges")) || 0,
        },
        logistics: {
          enabled: !!formData.get("transportMode"),
          transportation: formData.get("transportMode")
            ? [{ mode: formData.get("transportMode"), cost: 0 }]
            : [],
        },
      },
      cargoDetails: {
        description: formData.get("cargoDescription"),
        weight: Number(formData.get("cargoWeight")),
      },
      origin: formData.get("origin"),
      destination: formData.get("destination"),
      totalCost: Number(formData.get("totalCost")),
    };

    const quotation = await Quotation.create(quotationData);
    return { success: true, message: "Quotation created" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function getQuotations() {
  try {
    await dbConnect();
    const quotationsResponse = await Quotation.find({}).lean();
    const quotations = JSON.parse(JSON.stringify(quotationsResponse));

    return quotations.map((q: any) => ({
      ...q,
      _id: q._id.toString(), // Convert ObjectId to string
      validUntil: q.validUntil.split("T")[0], // Format date
      issuedDate: q.issuedDate.split("T")[0],
    }));
  } catch (error) {
    throw new Error("Failed to fetch quotations: " + (error as Error).message);
  }
}

export async function deleteQuotation(id: string) {
  try {
    await dbConnect();
    const result = await Quotation.findByIdAndDelete(id);
    if (!result) throw new Error("Quotation not found");
    return { success: true, message: "Quotation deleted successfully" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}
