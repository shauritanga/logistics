"use server";

import dbConnect from "@/lib/mongodb";
import { Invoice } from "@/models/index";
import { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}

interface InvoiceData {
  client: string;
  items: InvoiceItem[];
  tax: { rate: number };
  discount: { rate: number };
  dueDate: Date;
  paymentTerms: string;
  notes: string;
}

export type DataSource = FormData | InvoiceData;

export async function createInvoice(
  _: ActionResponse | null,
  data: DataSource,
  isPlain: Boolean | false
): Promise<ActionResponse> {
  const extractItems = (source: DataSource): InvoiceItem[] => {
    if (source instanceof FormData) {
      const items = [];
      let i = 0;
      while (source.has(`items[${i}][description]`)) {
        const description = source.get(`items[${i}][description]`);
        items.push({
          description: description ? String(description) : "",
          quantity: Number(source.get(`items[${i}][quantity]`)),
          unitPrice: Number(source.get(`items[${i}][unitPrice]`)),
          currency: String(source.get(`items[${i}][currency]`)) || "USD",
        });
        i++;
      }
      return items;
    }
    return source.items; // If it's plain object, items are already in correct format
  };

  // Helper function to get value based on data source type
  const getValue = (
    source: DataSource,
    key: string,
    defaultValue: any = null
  ) => {
    if (source instanceof FormData) {
      return source.get(key) ?? defaultValue;
    }
    return (source as InvoiceData)[key as keyof InvoiceData] ?? defaultValue;
  };

  const invoiceData: InvoiceData = !isPlain
    ? {
        client: getValue(data, "client"),
        items: extractItems(data),
        tax: {
          rate: Number(getValue(data, "tax", 0)),
        },
        discount: {
          rate: Number(getValue(data, "discount", 0)),
        },
        dueDate:
          data instanceof FormData
            ? new Date(getValue(data, "dueDate") as string)
            : (data as InvoiceData).dueDate,
        paymentTerms: getValue(data, "paymentTerms"),
        notes: getValue(data, "notes"),
      }
    : (data as InvoiceData);

  try {
    await dbConnect();
    const invoice = new Invoice(invoiceData);
    await invoice.save();
    revalidatePath("/dashboard/invoices");
    return { success: true, message: "Invoice created successfully" };
  } catch (error) {
    console.log({ error });
    return { success: false, message: "Invoice creation failed" };
  }
}

export async function getAllInvoices() {
  try {
    await dbConnect();
    const invoices = await Invoice.find().populate("client");

    return JSON.parse(JSON.stringify(invoices));
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
}

// Define the shape of the data expected from the form

// Update invoice server action
export async function updateInvoice(
  _: ActionResponse,
  data: DataSource,
  id: string,
  isPlain: Boolean | false
): Promise<ActionResponse> {
  const extractItems = (source: DataSource): InvoiceItem[] => {
    if (source instanceof FormData) {
      const items = [];
      let i = 0;
      while (source.has(`items[${i}][description]`)) {
        const description = source.get(`items[${i}][description]`);
        items.push({
          description: description ? String(description) : "",
          quantity: Number(source.get(`items[${i}][quantity]`)),
          unitPrice: Number(source.get(`items[${i}][unitPrice]`)),
          currency: String(source.get(`items[${i}][currency]`)) || "USD",
        });
        i++;
      }
      return items;
    }
    return source.items; // If it's plain object, items are already in correct format
  };

  const getValue = (
    source: DataSource,
    key: string,
    defaultValue: any = null
  ) => {
    if (source instanceof FormData) {
      return source.get(key) ?? defaultValue;
    }
    return (source as InvoiceData)[key as keyof InvoiceData] ?? defaultValue;
  };

  const invoiceData: InvoiceData = !isPlain
    ? {
        client: getValue(data, "client"),
        items: extractItems(data),
        tax: {
          rate: Number(getValue(data, "tax", 0)),
        },
        discount: {
          rate: Number(getValue(data, "discount", 0)),
        },
        dueDate:
          data instanceof FormData
            ? new Date(getValue(data, "dueDate") as string)
            : (data as InvoiceData).dueDate,
        paymentTerms: getValue(data, "paymentTerms"),
        notes: getValue(data, "notes"),
      }
    : (data as InvoiceData);

  try {
    await dbConnect();
    const invoice = await Invoice.findById(id);
    if (!invoice) throw new Error("Invoice not found");
    Object.assign(invoice, invoiceData);
    await invoice.save();

    revalidatePath("/dashboard/invoices");
    return { success: true, message: "Invoice updated successfully" };
  } catch (error) {
    console.log({ error });
    return { success: false, message: "Invoice update failed" };
  }
}

export async function deleteInvoice(id: string) {
  try {
    await dbConnect();
    const result = await Invoice.findByIdAndDelete(id);
    if (!result) throw new Error("Invoice not found");
    revalidatePath("/dashboard/invoices");
    return { success: true, message: "Invoice deleted successfully" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function markInvoiceAsPaid(id: string): Promise<ActionResponse> {
  try {
    await dbConnect();
    const invoice = await Invoice.findById(id);
    if (!invoice) throw new Error("Invoice not found");

    const updatedInvoice = await invoice.markAsPaid();
    if (!updatedInvoice) throw new Error("Failed to update invoice status");

    revalidatePath("/dashboard/invoices");
    return { success: true, message: "Invoice marked as paid successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: (error as Error).message };
  }
}

export async function markInvoiceAsOverdue(
  id: string
): Promise<ActionResponse> {
  try {
    await dbConnect();
    const invoice = await Invoice.findById(id);
    if (!invoice) throw new Error("Invoice not found");

    const updatedInvoice = await invoice.markAsOverDue();
    if (!updatedInvoice) throw new Error("Failed to update invoice status");

    revalidatePath("/dashboard/invoices");
    return { success: true, message: "Invoice marked as overdue successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: (error as Error).message };
  }
}

export async function markInvoiceAsCanceled(
  id: string
): Promise<ActionResponse> {
  try {
    await dbConnect();
    const invoice = await Invoice.findById(id);
    if (!invoice) throw new Error("Invoice not found");

    const updatedInvoice = await invoice.markAsCanceled();
    if (!updatedInvoice) throw new Error("Failed to update invoice status");

    revalidatePath("/dashboard/invoices");
    return {
      success: true,
      message: "Invoice marked as canceled successfully",
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: (error as Error).message };
  }
}
