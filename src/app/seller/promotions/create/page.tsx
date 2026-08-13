import type { Metadata } from "next";
import { PromotionCreateForm } from "@/features/promotions/promotion-create-form";

export const metadata: Metadata = {
  title: "Buat Flash Sale",
};

export default function SellerPromotionCreatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Buat Flash Sale</h1>
        <p className="text-sm text-muted-foreground">
          Tetapkan diskon dan jadwal untuk produk pilihan Anda.
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <PromotionCreateForm />
      </div>
    </div>
  );
}
