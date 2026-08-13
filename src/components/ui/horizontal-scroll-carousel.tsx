"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HorizontalScrollCarouselProps {
  children: React.ReactNode;
  className?: string;
}

export function HorizontalScrollCarousel({ children, className }: HorizontalScrollCarouselProps) {
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
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className={cn("relative", className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y gap-3 sm:gap-4">{children}</div>
      </div>

      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-l from-background to-transparent transition-opacity",
          canScrollNext ? "opacity-100" : "opacity-0"
        )}
      />

      <button
        type="button"
        aria-label="Sebelumnya"
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!canScrollPrev}
        className="absolute top-1/2 left-2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background text-foreground shadow-lg ring-1 ring-border hover:bg-surface disabled:pointer-events-none disabled:opacity-0 sm:h-9 sm:w-9"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Berikutnya"
        onClick={() => emblaApi?.scrollNext()}
        disabled={!canScrollNext}
        className="absolute top-1/2 right-2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background text-foreground shadow-lg ring-1 ring-border hover:bg-surface disabled:pointer-events-none disabled:opacity-0 sm:h-9 sm:w-9"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
