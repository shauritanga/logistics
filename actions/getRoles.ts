"use server";

import dbConnect from "@/lib/mongodb";
import { Role } from "@/models/index";

export default async function getRoles() {
  await dbConnect();
  const roles = await Role.find({});
  return JSON.parse(JSON.stringify(roles));
}
