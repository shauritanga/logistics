"use server";

import { auth } from "@/auth";
import User from "@/models/User";
import checkPermission from "@/lib/checkPermission";
import dbConnect from "@/lib/mongodb";
import { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";
import Transaction from "@/models/Transaction";

export async function createTransaction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  // Extract data from form
  const client = formData.get("client") as string;
  const amount = formData.get("amount") as string;
  const currency = formData.get("currency") as string;
  const category = formData.get("category") as string;
  const transactionDate = formData.get("transactionDate") as string;
  const description = formData.get("description") as string;
  try {
    await dbConnect();
    const session = await auth();
    const user = session?.user;

    await checkPermission(user?.role ?? "USER", "transactions", "create");

    console.log({
      currency,
      client,
      amount,
      category,
      transactionDate,
      description,
    });

    const transaction = new Transaction({
      client,
      currency,
      amount,
      category,
      transactionDate,
      description,
    });
    await transaction.save();
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/employees");
    return { success: true, message: `${category} has been saved` };
  } catch (error: any) {
    return { success: false, message: `${category} creation failed` };
  }
}

export async function readTransactions() {
  await dbConnect();
  const session = await auth();
  const user = session?.user;

  await checkPermission(user?.role ?? "USER", "transactions", "read");

  // Fetch employee from database
  const employees = await Transaction.find({ status: "pending" }).populate(
    "client"
  );
  return JSON.parse(JSON.stringify(employees));
}

export async function getPendingTransactionsCount() {
  await dbConnect();

  try {
    const count = await Transaction.countDocuments({ status: "pending" });
    return count;
  } catch (error) {
    console.error("Failed to fetch pending transactions count:", error);
    return 0;
  }
}

export async function readTransactionsByCategory(category: string) {
  await dbConnect();
  const session = await auth();
  const user = session?.user;

  await checkPermission(user?.role ?? "USER", "transactions", "read");

  // Fetch employee from database
  const transactions = await Transaction.find({ category: category }).populate(
    "client"
  );
  return JSON.parse(JSON.stringify(transactions));
}

export async function readTransaction(id: number) {
  await dbConnect();
  const session = await auth();
  const user = session?.user;

  await checkPermission(user?.role ?? "USER", "transactions", "read");

  // Fetch employee from database
  const transaction = await Transaction.findById(id);
  if (!transaction) throw new Error("Transaction not found");
  return transaction;
}

export async function updateTransaction(id: string, data: any) {
  await dbConnect();
  const session = await auth();
  const user = session?.user;

  await checkPermission(user?.role ?? "USER", "transactions", "update");

  // Update employee in database
  const transaction = await Transaction.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!transaction) throw new Error("Transaction not found");
  revalidatePath("/dashboard/transactions");
  return transaction;
}

export async function deleteTransaction(id: number) {
  await dbConnect();
  const session = await auth();
  const user = session?.user;

  await checkPermission(user?.role ?? "USER", "Transaction", "delete");

  // Delete employee from database
  const result = await User.findByIdAndDelete(id);
  if (!result) throw new Error("Transaction not found");
  return { message: "Transaction deleted successfully" };
}
