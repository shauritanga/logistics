import { cn } from "@/lib/utils";
import { FileText, Package, Box, ClipboardList } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: "file" | "package" | "box" | "list";
  className?: string;
  children?: React.ReactNode;
}

const iconMap = {
  file: FileText,
  package: Package,
  box: Box,
  list: ClipboardList,
};

export function EmptyState({
  title,
  description,
  icon = "file",
  className,
  children,
}: EmptyStateProps) {
  const Icon = iconMap[icon];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center",
        className
      )}
    >
      <div className="rounded-full bg-muted p-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
