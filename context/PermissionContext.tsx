import React, { createContext, useContext, ReactNode } from "react";

interface Permissions {
  [resource: string]: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
}

interface PermissionsContextProps {
  permissions: Permissions;
}

const PermissionsContext = createContext<PermissionsContextProps | undefined>(
  undefined
);

export const PermissionsProvider = ({
  children,
  permissions,
}: {
  children: ReactNode;
  permissions: Permissions;
}) => {
  return (
    <PermissionsContext.Provider value={{ permissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context.permissions;
};
