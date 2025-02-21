"use server";

import { auth } from "@/auth";
import User from "@/models/User";
import checkPermission from "@/lib/checkPermission";
import dbConnect from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";
import { enqueueSnackbar } from "notistack";

export async function createEmployee(
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
    const role = formData.get("role") as string;
    const position = formData.get("position") as string;
    const password = formData.get("password") as string;

    const hash = await bcrypt.hash(password, 10);

    const employee = new User({
      name,
      email,
      position,
      role,
      password: hash,
    });
    await employee.save();
    revalidatePath("/dashboard/employees");
    return { success: true, message: "Employee has been saved" };
  } catch (error: any) {
    if (error.code === 11000) {
      return { success: false, message: "Email already exists" };
    }
    return { success: false, message: "Employee creation failed" };
  }
}

export async function readEmployees() {
  await dbConnect();
  const session = await auth();
  const user = session?.user;

  await checkPermission(user?.role ?? "USER", "users", "read");

  // Fetch employee from database
  const employees = await User.find({});
  return JSON.parse(JSON.stringify(employees));
}

export async function readEmployee(id: number) {
  await dbConnect();
  const session = await auth();
  const user = session?.user;

  await checkPermission(user?.role ?? "USER", "users", "read");

  // Fetch employee from database
  const employee = await User.findById(id);
  if (!employee) throw new Error("Employee not found");
  return employee;
}

export async function updateEmployee(id: string, formData: FormData) {
  try {
    await dbConnect();
    const session = await auth();
    const user = session?.user;

    await checkPermission(user?.role ?? "USER", "users", "update");

    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      position: formData.get("position") as string,
      role: formData.get("role"),
    };
    // Update employee in database
    const employee = await User.findByIdAndUpdate(id, data, { new: true });
    if (!employee) throw new Error("Employee not found");
    revalidatePath("/dashboard/employees");
    return JSON.parse(JSON.stringify(employee));
  } catch (error) {
    return [];
  }
}

export async function deleteEmployee(id: string) {
  await dbConnect();
  const session = await auth();
  const user = session?.user;

  await checkPermission(user?.role ?? "USER", "users", "delete");

  // Delete employee from database
  const result = await User.findByIdAndDelete(id);
  if (!result) throw new Error("Employee not found");
  revalidatePath("/dashboard/employee");
  return { message: "Employee deleted successfully" };
}
