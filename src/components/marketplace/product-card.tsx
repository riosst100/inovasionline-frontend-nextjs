import Image from "next/image";
import Link from "next/link";
import type { PublicProduct } from "@/types/product";

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    amount
  );
}

function formatSoldCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)}rb`;
  }
  return String(count);
}

export function ProductCard({ product }: { product: PublicProduct }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-surface">
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 42vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-2.5">
        <p className="line-clamp-2 text-xs font-medium text-foreground sm:text-sm">{product.name}</p>
        {product.store_name && <p className="truncate text-xs text-muted-foreground">{product.store_name}</p>}

        <span className="text-sm font-bold text-foreground sm:text-base">
          {formatRupiah(Number(product.sale_price ?? product.regular_price))}
        </span>

        {product.sold_count > 0 && (
          <p className="mt-auto text-xs text-muted-foreground">{formatSoldCount(product.sold_count)} terjual</p>
        )}
      </div>
    </Link>
  );
}
