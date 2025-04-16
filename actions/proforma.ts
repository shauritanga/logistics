"use server";
import dbConnect from "@/lib/mongodb";
import { ProformaInvoice, IProformaInvoice } from "@/models/index";
import { revalidatePath } from "next/cache";

export async function createProformaInvoice(formData: any) {
  const { tax, discount } = formData;

  const proformaData = {
    ...formData,
    tax: { rate: Number(tax) },
    discount: { rate: Number(discount) },
  };

  try {
    await dbConnect();
    const proforma = new ProformaInvoice(proformaData);
    await proforma.save();
  } catch (error) {
    console.log(error);
  }
}

export async function getProformaInvoices(): Promise<
  IProformaInvoice[] | null
> {
  try {
    await dbConnect();
    const proformInvoices = await ProformaInvoice.find().populate([
      "client",
      { path: "bol", populate: ["consignee", "notifyParty", "shipper"] },
    ]);
    return JSON.parse(JSON.stringify(proformInvoices));
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function deleteProformaInvoice(id: string) {
  try {
    await dbConnect();
    const result = await ProformaInvoice.findByIdAndDelete(id);
    if (!result) throw new Error("Proforma Invoce not found");
    revalidatePath("/dashboard/invoices");
    return { success: true, message: "Proforma Invoice deleted successfully" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}
