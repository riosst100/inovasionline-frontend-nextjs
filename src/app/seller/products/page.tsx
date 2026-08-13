import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductList } from "@/features/products/product-list";

export const metadata: Metadata = {
  title: "Produk Seller",
};

export default function SellerProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Produk</h1>
          <p className="text-sm text-muted-foreground">Kelola daftar produk toko Anda.</p>
        </div>
        <Button asChild>
          <Link href="/seller/products/create">
            <Plus />
            Tambah Produk
          </Link>
        </Button>
      </div>

      <ProductList />
    </div>
  );
}
