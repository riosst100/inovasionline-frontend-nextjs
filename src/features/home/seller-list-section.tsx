"use client";

import { Store as StoreIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HorizontalScrollCarousel } from "@/components/ui/horizontal-scroll-carousel";
import { SellerCard } from "@/components/marketplace/seller-card";
import { usePublicStores } from "@/features/home/use-public-stores";
import type { StoreSort } from "@/types/product";

const TABS: { value: StoreSort; label: string }[] = [
  { value: "nearest", label: "Terdekat" },
  { value: "popular", label: "Populer" },
  { value: "newest", label: "Terbaru" },
];

function SellerTabPanel({ sort }: { sort: StoreSort }) {
  const { data: stores, isLoading, noLocation } = usePublicStores(sort);

  if (noLocation) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Pilih lokasi Anda terlebih dahulu untuk melihat toko terdekat.
      </p>
    );
  }

  if (!isLoading && (!stores || stores.length === 0)) {
    return <p className="py-8 text-center text-sm text-muted-foreground">Belum ada toko untuk ditampilkan.</p>;
  }

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-hidden sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/3] min-w-0 flex-[0_0_65%] rounded-xl sm:flex-[0_0_38%] lg:flex-[0_0_28%]" />
        ))}
      </div>
    );
  }

  return (
    <HorizontalScrollCarousel>
      {stores?.map((store) => (
        <SellerCard key={store.id} store={store} />
      ))}
    </HorizontalScrollCarousel>
  );
}

export function SellerListSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center gap-2">
        <StoreIcon className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold sm:text-xl">Toko Pilihan</h2>
      </div>

      <Tabs defaultValue="nearest">
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4">
            <SellerTabPanel sort={tab.value} />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
