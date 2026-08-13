"use client";

import { SearchX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/marketplace/product-card";
import { SellerCard } from "@/components/marketplace/seller-card";
import { useSearchResults } from "@/features/search/use-search";

export function SearchResults({ query }: { query: string }) {
  const { data, isLoading } = useSearchResults(query);

  const products = data?.products ?? [];
  const stores = data?.stores ?? [];
  const hasResults = products.length > 0 || stores.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-lg font-bold sm:text-xl">
        Hasil pencarian untuk <span className="text-primary">&ldquo;{query}&rdquo;</span>
      </h1>

      {isLoading ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : !hasResults ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <SearchX className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Tidak ditemukan hasil untuk &ldquo;{query}&rdquo;. Coba kata kunci lain.
          </p>
        </div>
      ) : (
        <>
          {stores.length > 0 && (
            <section className="mt-6">
              <h2 className="mb-3 text-sm font-semibold text-foreground">Toko</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {stores.map((store) => (
                  <SellerCard key={store.id} store={store} className="flex-none" />
                ))}
              </div>
            </section>
          )}

          {products.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-3 text-sm font-semibold text-foreground">Produk</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
