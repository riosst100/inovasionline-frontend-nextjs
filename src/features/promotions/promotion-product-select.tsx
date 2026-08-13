"use client";

import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/features/products/use-products";

interface PromotionProductSelectProps {
  value: string[];
  onChange: (ids: string[]) => void;
}

function formatRupiah(amount: string) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    Number(amount)
  );
}

export function PromotionProductSelect({ value, onChange }: PromotionProductSelectProps) {
  const { data, isLoading } = useProducts();
  const products = data?.data ?? [];

  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
        Anda belum memiliki produk. Tambahkan produk terlebih dahulu sebelum membuat promosi.
      </p>
    );
  }

  return (
    <div className="max-h-72 space-y-1 overflow-y-auto rounded-lg border border-border p-2">
      {products.map((product) => (
        <label
          key={product.id}
          className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-muted/50"
        >
          <Checkbox checked={value.includes(product.id)} onCheckedChange={() => toggle(product.id)} />
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
            {product.images[0] && (
              <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{product.name}</p>
            <p className="text-xs text-muted-foreground">{formatRupiah(product.regular_price)}</p>
          </div>
        </label>
      ))}
    </div>
  );
}
