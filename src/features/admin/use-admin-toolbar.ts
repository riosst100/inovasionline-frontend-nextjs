"use client";

import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/features/auth/use-auth";

export function useAdminToolbarVisible(): boolean {
  const { data: user } = useCurrentUser();
  const pathname = usePathname();

  return user?.role === "platform_admin" && !pathname.startsWith("/admin");
}
