import type { Metadata } from "next";
import { ProductEditForm } from "@/features/products/product-edit-form";

export const metadata: Metadata = {
  title: "Edit Produk",
};

export default async function SellerProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Produk</h1>
        <p className="text-sm text-muted-foreground">Perbarui informasi produk Anda.</p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <ProductEditForm productId={id} />
      </div>
    </div>
  );
}
