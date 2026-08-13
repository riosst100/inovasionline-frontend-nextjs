"use client";

import Image from "next/image";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { HorizontalScrollCarousel } from "@/components/ui/horizontal-scroll-carousel";
import { useBestSellerProducts } from "@/features/home/use-public-products";

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

export function BestSellerSection() {
  const { data: products, isLoading } = useBestSellerProducts();

  if (!isLoading && (!products || products.length === 0)) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold sm:text-xl">Produk Terlaris</h2>
        </div>
      </div>

      {isLoading ? (
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square min-w-0 flex-[0_0_40%] rounded-xl sm:flex-[0_0_23%] lg:flex-[0_0_18%]" />
          ))}
        </div>
      ) : (
        <HorizontalScrollCarousel>
          {products?.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group flex min-w-0 flex-[0_0_40%] flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md sm:flex-[0_0_23%] lg:flex-[0_0_18%]"
            >
              <div className="relative aspect-square overflow-hidden bg-surface">
                {product.image_url && (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 18vw, (min-width: 640px) 23vw, 42vw"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                )}
                <Badge className="absolute top-2 left-2 gap-1 bg-primary text-primary-foreground hover:bg-primary">
                  <TrendingUp className="h-3 w-3" />
                  Terlaris
                </Badge>
              </div>

              <div className="flex flex-1 flex-col gap-1.5 p-2.5">
                <p className="line-clamp-2 text-xs font-medium text-foreground sm:text-sm">{product.name}</p>
                {product.store_name && (
                  <p className="truncate text-xs text-muted-foreground">{product.store_name}</p>
                )}

                <span className="text-sm font-bold text-foreground sm:text-base">
                  {formatRupiah(Number(product.sale_price ?? product.regular_price))}
                </span>

                {product.sold_count > 0 && (
                  <p className="mt-auto text-xs text-muted-foreground">{formatSoldCount(product.sold_count)} terjual</p>
                )}
              </div>
            </Link>
          ))}
        </HorizontalScrollCarousel>
      )}
    </section>
  );
}
