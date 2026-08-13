import type { Metadata } from "next";
import { ProductCreateForm } from "@/features/products/product-create-form";

export const metadata: Metadata = {
  title: "Tambah Produk",
};

export default function SellerProductCreatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tambah Produk</h1>
        <p className="text-sm text-muted-foreground">
          Lengkapi informasi produk yang akan Anda jual.
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <ProductCreateForm />
      </div>
    </div>
  );
}
