"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsRestoring } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { useCurrentUser } from "@/features/auth/use-auth";

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const isRestoring = useIsRestoring();
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();

  const isChecking = isRestoring || isLoading;
  const isAuthorized = user?.role === "platform_admin";

  useEffect(() => {
    if (isChecking) return;

    if (!user) {
      router.replace("/admin/login");
      return;
    }

    if (!isAuthorized) {
      router.replace("/");
    }
  }, [isChecking, user, isAuthorized, router]);

  if (isChecking || !isAuthorized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminTopbar />
        <main className="flex-1 bg-surface/40 p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
