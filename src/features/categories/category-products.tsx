"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, LayoutGrid, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/marketplace/product-card";
import { ApiError } from "@/types/api";
import { useCategoryDetail } from "@/features/categories/use-category-detail";

export function CategoryProducts({ slug }: { slug: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError, error } = useCategoryDetail(slug, page);

  if (isLoading) {
    return <CategoryProductsSkeleton />;
  }

  if (isError || !data) {
    const notFound = error instanceof ApiError && error.status === 404;

    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-4 py-24 text-center">
        <LayoutGrid className="h-10 w-10 text-muted-foreground" />
        <h1 className="text-xl font-semibold">
          {notFound ? "Kategori tidak ditemukan" : "Gagal memuat kategori"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {notFound
            ? "Kategori ini mungkin sudah tidak tersedia atau tautannya salah."
            : "Terjadi kesalahan saat memuat kategori. Silakan coba lagi."}
        </p>
        <Button asChild>
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
      </div>
    );
  }

  const { category, products } = data.data;
  const { meta } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-lg font-bold sm:text-xl">{category.name}</h1>
      {category.description && (
        <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
      )}

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <PackageSearch className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Belum ada produk di kategori ini.</p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {meta.last_page > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
                Sebelumnya
              </Button>
              <span className="text-sm text-muted-foreground">
                Halaman {meta.current_page} dari {meta.last_page}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= meta.last_page || isFetching}
                onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              >
                Berikutnya
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CategoryProductsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="h-6 w-48" />
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    </div>
  );
}
