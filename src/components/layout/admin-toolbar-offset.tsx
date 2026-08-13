"use client";

import { useAdminToolbarVisible } from "@/features/admin/use-admin-toolbar";
import { cn } from "@/lib/utils";

export function AdminToolbarOffset({ children }: { children: React.ReactNode }) {
  const visible = useAdminToolbarVisible();

  return <div className={cn(visible && "pt-9")}>{children}</div>;
}
