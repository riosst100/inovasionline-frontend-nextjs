import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryList } from "@/features/categories/category-list";

export const metadata: Metadata = {
  title: "Kategori Seller",
};

export default function SellerCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kategori</h1>
          <p className="text-sm text-muted-foreground">Kelola dan ajukan sub kategori produk untuk toko Anda.</p>
        </div>
        <Button asChild>
          <Link href="/seller/categories/create">
            <Plus />
            Ajukan Sub Kategori
          </Link>
        </Button>
      </div>

      <CategoryList />
    </div>
  );
}
