"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Package, ShieldCheck, Store as StoreIcon, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ApiError } from "@/types/api";
import { useProductDetail } from "@/features/home/use-public-products";
import { formatRupiah } from "@/features/home/flash-sale-shared";

export function ProductDetail({ slug }: { slug: string }) {
  const { data: product, isLoading, isError, error } = useProductDetail(slug);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError || !product) {
    const notFound = error instanceof ApiError && error.status === 404;

    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-4 py-24 text-center">
        <Package className="h-10 w-10 text-muted-foreground" />
        <h1 className="text-xl font-semibold">
          {notFound ? "Produk tidak ditemukan" : "Gagal memuat produk"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {notFound
            ? "Produk ini mungkin sudah tidak tersedia atau tautannya salah."
            : "Terjadi kesalahan saat memuat detail produk. Silakan coba lagi."}
        </p>
        <Button asChild>
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [];
  const activeImage = images[activeImageIndex] ?? images[0];
  const hasDiscount = product.sale_price !== null;
  const outOfStock = product.stock <= 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface">
            {activeImage ? (
              <Image
                src={activeImage.url}
                alt={activeImage.alt_text ?? product.name}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <Package className="h-12 w-12" />
              </div>
            )}
            {product.discount_percent !== null && (
              <Badge className="absolute top-3 left-3 bg-red-600 text-white hover:bg-red-600">
                -{product.discount_percent}%
              </Badge>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={cn(
                    "relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors sm:w-20",
                    index === activeImageIndex ? "border-primary" : "border-transparent"
                  )}
                >
                  <Image src={image.url} alt={image.alt_text ?? product.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            {product.category && (
              <span className="text-xs font-medium text-muted-foreground">{product.category.name}</span>
            )}
            <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">{product.name}</h1>
            {product.short_description && (
              <p className="mt-2 text-sm text-muted-foreground">{product.short_description}</p>
            )}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-foreground sm:text-3xl">
              {formatRupiah(Number(product.sale_price ?? product.regular_price))}
            </span>
            {hasDiscount && (
              <span className="text-base text-muted-foreground line-through">
                {formatRupiah(Number(product.regular_price))}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {product.sold_count > 0 && <span>{product.sold_count} terjual</span>}
            {product.sold_count > 0 && <span aria-hidden>&middot;</span>}
            <span className={outOfStock ? "text-destructive" : undefined}>
              {outOfStock ? "Stok habis" : `Stok ${product.stock}`}
            </span>
          </div>

          <Button size="lg" className="w-full sm:w-auto" disabled={outOfStock}>
            {outOfStock ? "Stok Habis" : "Beli Sekarang"}
          </Button>

          <Separator />

          {product.store && (
            <div className="flex items-center gap-3 rounded-xl border border-border p-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-muted">
                {product.store.logo_url ? (
                  <Image src={product.store.logo_url} alt={product.store.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <StoreIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{product.store.name}</p>
                {product.store.city && (
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {product.store.city}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            {product.requires_shipping && (
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 shrink-0" />
                <span>Produk ini memerlukan pengiriman{product.weight ? ` · berat ${product.weight} kg` : ""}</span>
              </div>
            )}
            {product.store?.delivery_available && (
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Toko ini melayani pengiriman</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {product.description && (
        <div className="mt-10">
          <Separator className="mb-6" />
          <h2 className="mb-3 text-lg font-bold text-foreground">Deskripsi Produk</h2>
          <div className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
