import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PromotionList } from "@/features/promotions/promotion-list";

export const metadata: Metadata = {
  title: "Promosi Seller",
};

export default function SellerPromotionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Promosi</h1>
          <p className="text-sm text-muted-foreground">Kelola flash sale dan diskon produk toko Anda.</p>
        </div>
        <Button asChild>
          <Link href="/seller/promotions/create">
            <Plus />
            Buat Flash Sale
          </Link>
        </Button>
      </div>

      <PromotionList />
    </div>
  );
}
