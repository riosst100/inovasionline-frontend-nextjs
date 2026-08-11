import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { SellerApplicationGate } from "@/features/seller/seller-application-gate";

export const metadata: Metadata = {
  title: "Jadi Seller",
};

export default function BecomeASellerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-2 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-md shadow-accent/30">
          <Sparkles className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Jadi Seller di Inovasi Online</h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          Buka toko Anda dan mulai jual produk ke jutaan pelanggan. Lengkapi formulir di bawah untuk
          mengajukan diri menjadi seller.
        </p>
      </div>

      <SellerApplicationGate />
    </div>
  );
}
