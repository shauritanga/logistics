"use server";
import dbConnect from "@/lib/mongodb";
import ProformaInvoice, { IProformaInvoice } from "@/models/ProformaInvoice";
import { redirect } from "next/navigation";

export async function createProformaInvoice(formData: any) {
  try {
    await dbConnect();
    const proforma = new ProformaInvoice(formData);
    await proforma.save();
    redirect("/dashboard/proforma-invoices");
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
    console.log({ proformInvoices });
    return JSON.parse(JSON.stringify(proformInvoices));
  } catch (error) {
    return null;
  }
}
