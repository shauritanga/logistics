import Role from "@/models/Role";

export default async function checkPermission(
  userRole: string,
  resource: string,
  action: "create" | "read" | "update" | "delete"
) {
  const role = await Role.findOne({ name: userRole });
  if (!role || !role.permissions[resource]?.[action]) {
    throw new Error("Unauthorized action");
  }
}
