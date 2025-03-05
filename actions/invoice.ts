"use server";

import dbConnect from "@/lib/mongodb";
import Invoice from "@/models/Invoice";
import { ActionResponse } from "@/types";

export async function createInvoice(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const items = [];
  let i = 0;
  while (formData.has(`items[${i}][description]`)) {
    items.push({
      description: formData.get(`items[${i}][description]`),
      quantity: Number(formData.get(`items[${i}][quantity]`)),
      unitPrice: Number(formData.get(`items[${i}][unitPrice]`)),
    });
    i++;
  }
  const invoiceData = {
    client: formData.get("client"),
    items,
    tax: {
      rate: Number(formData.get("tax")) || 0,
    },
    discount: {
      rate: Number(formData.get("discount")) || 0,
    },
    dueDate: new Date(formData.get("dueDate") as string),
    paymentTerms: formData.get("paymentTerms"),
    notes: formData.get("notes"),
  };

  try {
    await dbConnect();
    const invoice = new Invoice(invoiceData);
    await invoice.save();
    return { success: true, message: "Invoice created successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Invoice creation failed" };
  }
}

export async function getAllInvoices() {
  try {
    await dbConnect();
    const invoices = await Invoice.find().populate("client");
    console.log({ invoices });
    return JSON.parse(JSON.stringify(invoices));
  } catch (error) {}
}
