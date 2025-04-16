"use server";

import dbConnect from "@/lib/mongodb";
import { Report } from "@/models";
import { revalidatePath } from "next/cache";

// Server Actions
export async function getReports() {
  await dbConnect();
  const reports = await Report.find().sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(reports)); // Convert to plain JS object
}

export async function createReport(formData: {
  title: string;
  content: string;
  status: "draft" | "in-review" | "completed";
  employeeName: string;
}) {
  await dbConnect();
  const report = new Report(formData);
  await report.save();

  revalidatePath("/dashboard/reports");
  return JSON.parse(JSON.stringify(report));
}

export async function updateReport(
  id: string,
  formData: {
    title: string;
    content: string;
    status: "draft" | "in-review" | "completed";
  }
) {
  await dbConnect();
  const report = await Report.findByIdAndUpdate(id, formData, { new: true });
  revalidatePath("/dashboard/reports");
  return JSON.parse(JSON.stringify(report));
}

export async function deleteReport(id: string) {
  try {
    await dbConnect();
    const resu = await Report.findByIdAndDelete(id);
    revalidatePath("/dashboard/reports");
  } catch (error) {
    console.log(error);
  }
}
