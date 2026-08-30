import type { Metadata } from "next";
import { CategoryCreateForm } from "@/features/categories/category-create-form";

export const metadata: Metadata = {
  title: "Ajukan Sub Kategori",
};

export default function SellerCategoryCreatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ajukan Sub Kategori</h1>
        <p className="text-sm text-muted-foreground">
          Sub kategori baru akan ditinjau oleh admin sebelum aktif digunakan.
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <CategoryCreateForm />
      </div>
    </div>
  );
}
