"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromoBanner {
  id: string;
  alt: string;
  href: string;
  image: string;
}

const BANNERS: PromoBanner[] = [
  {
    id: "flash-sale",
    alt: "Flash Sale Hari Ini",
    href: "/promotions",
    image: "/banners/flash-sale.svg",
  },
  {
    id: "local-sellers",
    alt: "Dukung Seller Lokal",
    href: "/stores",
    image: "/banners/local-sellers.svg",
  },
  {
    id: "become-seller",
    alt: "Buka Toko Sendiri",
    href: "/become-a-seller",
    image: "/banners/become-seller.svg",
  },
];

export function PromoBannerSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
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

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {BANNERS.map((banner, index) => (
            <div key={banner.id} className="min-w-0 flex-[0_0_100%] px-1">
              <Link href={banner.href} className="relative block h-40 overflow-hidden rounded-2xl sm:h-56">
                <Image
                  src={banner.image}
                  alt={banner.alt}
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1280px) 1152px, 100vw"
                  className="object-cover"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="Sebelumnya"
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute top-1/2 left-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/50 text-foreground shadow-md hover:bg-background/70 sm:h-9 sm:w-9 sm:bg-background/90 sm:shadow-md sm:ring-1 sm:ring-border sm:hover:bg-background"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Berikutnya"
        onClick={() => emblaApi?.scrollNext()}
        className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/50 text-foreground shadow-md hover:bg-background/70 sm:h-9 sm:w-9 sm:bg-background/90 sm:shadow-md sm:ring-1 sm:ring-border sm:hover:bg-background"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="mt-3 flex items-center justify-center gap-1.5">
        {BANNERS.map((banner, index) => (
          <button
            key={banner.id}
            type="button"
            aria-label={`Ke banner ${index + 1}`}
            onClick={() => emblaApi?.scrollTo(index)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              index === selectedIndex ? "w-6 bg-primary" : "w-1.5 bg-border"
            )}
          />
        ))}
      </div>
    </div>
  );
}
