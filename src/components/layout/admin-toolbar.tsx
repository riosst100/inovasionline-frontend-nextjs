"use client";

import Link from "next/link";
import { LayoutDashboard, ShieldCheck, Store, Users } from "lucide-react";
import { useAdminToolbarVisible } from "@/features/admin/use-admin-toolbar";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/sellers", label: "Seller Applications", icon: Store },
];

export function AdminToolbar() {
  const visible = useAdminToolbarVisible();

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex h-9 items-center gap-1 overflow-x-auto bg-neutral-900 px-2 text-neutral-100 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <span className="flex shrink-0 items-center gap-1.5 pr-2 text-xs font-semibold text-neutral-400">
        <ShieldCheck className="h-3.5 w-3.5" />
        Admin
      </span>

      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="flex shrink-0 items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-neutral-200 transition-colors hover:bg-white/10 hover:text-white"
        >
          <link.icon className="h-3.5 w-3.5" />
          {link.label}
        </Link>
      ))}
    </div>
  );
}
