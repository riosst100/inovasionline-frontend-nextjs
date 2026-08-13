import type { Metadata } from "next";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Tag,
  Wallet,
  Truck,
  Store,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Dashboard Seller",
};

const QUICK_ACTIONS: { href: string; label: string; description: string; icon: LucideIcon }[] = [
  { href: "/seller/orders", label: "Pesanan", description: "Kelola pesanan masuk", icon: ShoppingCart },
  { href: "/seller/products", label: "Produk", description: "Kelola daftar produk", icon: Package },
  { href: "/seller/promotions", label: "Promosi", description: "Atur diskon & promo", icon: Tag },
  { href: "/seller/payment-methods", label: "Metode Pembayaran", description: "Kelola metode pembayaran", icon: Wallet },
  { href: "/seller/shipping-methods", label: "Metode Pengiriman", description: "Kelola metode pengiriman", icon: Truck },
  { href: "/seller/store-profile", label: "Profil Toko", description: "Kelola info toko Anda", icon: Store },
  { href: "/seller/settings", label: "Pengaturan", description: "Pengaturan akun seller", icon: Settings },
];

export default function SellerDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan performa toko Anda akan tampil di sini.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {QUICK_ACTIONS.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardContent className="flex flex-col items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <action.icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">
          Statistik dashboard dan grafik akan diimplementasikan pada fase berikutnya.
        </p>
      </div>
    </div>
  );
}
