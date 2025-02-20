"use server";

import Role from "@/models/Role";
import dbConnect from "@/lib/mongodb";

export default async function createRoles(role: any) {
  await dbConnect();
  try {
    const roleRes = new Role({
      name: role.name,
      permissions: role.permissions,
    });
    await roleRes.save();
    return { success: true, message: "Role has been saved" };
  } catch (error: any) {
    console.log(error);
    return { success: false, message: "Role creation failed" };
  }
}
