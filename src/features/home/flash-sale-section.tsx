"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCountdown } from "@/features/home/use-countdown";
import { cn } from "@/lib/utils";

interface FlashSaleProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  soldPercent: number;
}

const FLASH_SALE_PRODUCTS: FlashSaleProduct[] = [
  {
    id: "1",
    name: "Kaos Polos Premium Cotton Combed 30s",
    image: "/products/placeholder-1.svg",
    price: 45000,
    originalPrice: 89000,
    discountPercent: 49,
    soldPercent: 72,
  },
  {
    id: "2",
    name: "Tas Selempang Kulit Sintetis Anti Air",
    image: "/products/placeholder-2.svg",
    price: 125000,
    originalPrice: 250000,
    discountPercent: 50,
    soldPercent: 45,
  },
  {
    id: "3",
    name: "Botol Minum Stainless Steel 1 Liter",
    image: "/products/placeholder-3.svg",
    price: 38000,
    originalPrice: 65000,
    discountPercent: 42,
    soldPercent: 90,
  },
  {
    id: "4",
    name: "Lampu Meja LED Touch Dimmable",
    image: "/products/placeholder-4.svg",
    price: 79000,
    originalPrice: 159000,
    discountPercent: 50,
    soldPercent: 28,
  },
  {
    id: "5",
    name: "Kaos Polos Premium Cotton Combed 24s",
    image: "/products/placeholder-1.svg",
    price: 39000,
    originalPrice: 75000,
    discountPercent: 48,
    soldPercent: 55,
  },
  {
    id: "6",
    name: "Tas Ransel Kanvas Kapasitas Besar",
    image: "/products/placeholder-2.svg",
    price: 149000,
    originalPrice: 299000,
    discountPercent: 50,
    soldPercent: 63,
  },
];

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    amount
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-white/15 px-1.5 font-mono text-base font-bold tabular-nums">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-1 text-[10px] uppercase tracking-wide opacity-80">{label}</span>
    </div>
  );
}

export function FlashSaleSection() {
  const [targetTime] = useState(() => Date.now() + 3 * 60 * 60 * 1000 + 24 * 60 * 1000);
  const countdown = useCountdown(targetTime);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 rounded-t-2xl bg-gradient-to-r from-red-600 to-orange-500 px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 fill-white" />
          <h2 className="text-lg font-bold sm:text-xl">Flash Sale</h2>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <div className="flex items-center gap-2">
            <span className="hidden text-sm font-medium opacity-90 sm:inline">Berakhir dalam</span>
            <div className="flex items-center gap-1">
              <CountdownUnit value={countdown.hours} label="Jam" />
              <span className="pb-4 font-bold">:</span>
              <CountdownUnit value={countdown.minutes} label="Menit" />
              <span className="pb-4 font-bold">:</span>
              <CountdownUnit value={countdown.seconds} label="Detik" />
            </div>
          </div>

          <Link
            href="/promotions/flash-sale"
            className="shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium hover:bg-white/25"
          >
            Lihat Semua
          </Link>
        </div>
      </div>

      <div className="relative rounded-b-2xl border border-t-0 border-border bg-card p-4 sm:p-5">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y gap-3 sm:gap-4">
            {FLASH_SALE_PRODUCTS.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group flex min-w-0 flex-[0_0_40%] flex-col overflow-hidden rounded-xl border border-border transition-shadow hover:shadow-md sm:flex-[0_0_23%] lg:flex-[0_0_18%]"
              >
                <div className="relative aspect-square overflow-hidden bg-surface">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 18vw, (min-width: 640px) 23vw, 42vw"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <Badge className="absolute top-2 left-2 bg-red-600 text-white hover:bg-red-600">
                    -{product.discountPercent}%
                  </Badge>
                </div>

                <div className="flex flex-1 flex-col gap-1.5 p-2.5">
                  <p className="line-clamp-2 text-xs font-medium text-foreground sm:text-sm">
                    {product.name}
                  </p>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-red-600 sm:text-base">
                      {formatRupiah(product.price)}
                    </span>
                    <span className="text-xs text-muted-foreground line-through">
                      {formatRupiah(product.originalPrice)}
                    </span>
                  </div>

                  <div className="mt-auto space-y-1">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400"
                        style={{ width: `${product.soldPercent}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground">{product.soldPercent}% terjual</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-label="Sebelumnya"
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canScrollPrev}
          className={cn(
            "absolute top-1/2 left-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md ring-1 ring-border hover:bg-background disabled:pointer-events-none disabled:opacity-0 sm:h-9 sm:w-9"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Berikutnya"
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canScrollNext}
          className={cn(
            "absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md ring-1 ring-border hover:bg-background disabled:pointer-events-none disabled:opacity-0 sm:h-9 sm:w-9"
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
