import { usePermissions } from "@/context/PermissionContext";
import React from "react";

interface WithPermissionProps {
  resource: string;
  action: "create" | "read" | "update" | "delete";
  children: React.ReactNode;
}

const withPermission = ({
  resource,
  action,
  children,
}: WithPermissionProps) => {
  const permissions = usePermissions();

  if (permissions[resource] && permissions[resource][action]) {
    return <>{children}</>;
  }

  return null;
};

export default withPermission;
