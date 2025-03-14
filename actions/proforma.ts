"use server";
import dbConnect from "@/lib/mongodb";
import ProformaInvoice, { IProformaInvoice } from "@/models/ProformaInvoice";

export async function createProformaInvoice(formData: any) {
  const { tax, discount } = formData;

  const proformaData = {
    ...formData,
    tax: { rate: Number(tax) },
    discount: { rate: Number(discount) },
  };
  console.log({ proformaData });
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
