"use server";

import { auth } from "@/auth";
import User from "@/models/User";
import checkPermission from "@/lib/checkPermission";
import dbConnect from "@/lib/mongodb";
import { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";
import Client from "@/models/Client";

export async function createClient(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    await dbConnect();
    const session = await auth();
    const user = session?.user;

    await checkPermission(user?.role ?? "USER", "users", "create");

    // Extract data from form
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const district = formData.get("district") as string;
    const country = formData.get("country") as string;
    const region = formData.get("region") as string;
    const street = formData.get("street") as string;
    const phone = formData.get("phone") as string;

    console.log({ name, email, district, country, region, street, phone });

    const employee = new Client({
      name,
      email,
      district,
      country,
      region,
      street,
      phone,
    });
    await employee.save();
    revalidatePath("/dashboard/clients");
    return { success: true, message: "Employee has been saved" };
  } catch (error: any) {
    if (error.code === 11000) {
      return { success: false, message: "Email already exists" };
    }
    return { success: false, message: "Employee creation failed" };
  }
}

export async function readClients() {
  await dbConnect();
  const session = await auth();
  const user = session?.user;

  await checkPermission(user?.role ?? "USER", "users", "read");

  // Fetch employee from database
  const employees = await Client.find({});
  return JSON.parse(JSON.stringify(employees));
}

export async function readClient(id: number) {
  await dbConnect();
  const session = await auth();
  const user = session?.user;

  await checkPermission(user?.role ?? "USER", "users", "read");

  // Fetch employee from database
  const employee = await User.findById(id);
  if (!employee) throw new Error("Employee not found");
  return employee;
}

export async function updateClient(id: number, data: any) {
  await dbConnect();
  const session = await auth();
  const user = session?.user;

  await checkPermission(user?.role ?? "USER", "users", "update");

  // Update employee in database
  const employee = await User.findByIdAndUpdate(id, data, { new: true });
  if (!employee) throw new Error("Employee not found");
  return employee;
}

export async function deleteClient(id: number) {
  await dbConnect();
  const session = await auth();
  const user = session?.user;

  await checkPermission(user?.role ?? "USER", "users", "delete");

  // Delete employee from database
  const result = await User.findByIdAndDelete(id);
  if (!result) throw new Error("Employee not found");
  return { message: "Employee deleted successfully" };
}
