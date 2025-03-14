import { Role } from "@/models/index";

interface Permissions {
  [resource: string]: {
    [action in "create" | "read" | "update" | "delete"]?: boolean;
  };
}

export default async function checkPermission(
  userRole: string,
  resource: string,
  action: "create" | "read" | "update" | "delete"
) {
  const role = await Role.findOne({ name: userRole });
  if (!role || !(role.permissions as Permissions)[resource]?.[action]) {
    throw new Error(
      `Role ${userRole} is not authorized to ${action} ${resource}`
    );
  }
}
