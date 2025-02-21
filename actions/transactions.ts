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
  try {
    await dbConnect();
    const session = await auth();
    const user = session?.user;

    await checkPermission(user?.role ?? "USER", "users", "create");

    // Extract data from form
    const client = formData.get("client") as string;
    const amount = formData.get("amount") as string;
    const category = formData.get("category") as string;
    const transactionDate = formData.get("transactionDate") as string;
    const description = formData.get("description") as string;
    console.log({ client, amount, category, transactionDate, description });

    const transaction = new Transaction({
      client,
      amount,
      category,
      transactionDate,
      description,
    });
    await transaction.save();
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/employees");
    return { success: true, message: "Employee has been saved" };
  } catch (error: any) {
    if (error.code === 11000) {
      return { success: false, message: "Email already exists" };
    }
    return { success: false, message: "Employee creation failed" };
  }
}

export async function readTransactions() {
  await dbConnect();
  const session = await auth();
  const user = session?.user;

  await checkPermission(user?.role ?? "USER", "users", "read");

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

  await checkPermission(user?.role ?? "USER", "users", "read");

  // Fetch employee from database
  const employees = await Transaction.find({ category: category }).populate(
    "client"
  );
  return JSON.parse(JSON.stringify(employees));
}

export async function readTransaction(id: number) {
  await dbConnect();
  const session = await auth();
  const user = session?.user;

  await checkPermission(user?.role ?? "USER", "users", "read");

  // Fetch employee from database
  const employee = await Transaction.findById(id);
  if (!employee) throw new Error("Employee not found");
  return employee;
}

export async function updateTransaction(id: string, data: any) {
  await dbConnect();
  const session = await auth();
  const user = session?.user;

  await checkPermission(user?.role ?? "USER", "users", "update");

  // Update employee in database
  const transaction = await Transaction.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!transaction) throw new Error("Employee not found");
  revalidatePath("/dashboard/transactions");
  return transaction;
}

export async function deleteTransaction(id: number) {
  await dbConnect();
  const session = await auth();
  const user = session?.user;

  await checkPermission(user?.role ?? "USER", "users", "delete");

  // Delete employee from database
  const result = await User.findByIdAndDelete(id);
  if (!result) throw new Error("Employee not found");
  return { message: "Employee deleted successfully" };
}
