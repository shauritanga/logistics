"use server";

import dbConnect from "@/lib/mongodb";
import Role from "@/models/Role";

export default async function getRoles() {
  await dbConnect();
  const roles = await Role.find({});
  return roles;
}
