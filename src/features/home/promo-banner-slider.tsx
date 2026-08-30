"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { bannerService } from "@/services/banner.service";
import type { PublicBanner } from "@/types/banner";

function BannerSlide({ banner, priority }: { banner: PublicBanner; priority: boolean }) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const image = (
    <div className="relative h-40 overflow-hidden rounded-2xl bg-black sm:h-56">
      <Image
        src={banner.image_url}
        alt={banner.name}
        fill
        priority={priority}
        sizes="(min-width: 1280px) 1152px, 100vw"
        className="object-contain"
      />
    </div>
  );

  if (banner.link_url) {
    return (
      <a href={banner.link_url} target="_blank" rel="noopener noreferrer" className="block">
        {image}
      </a>
    );
  }

  return (
    <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
      <button type="button" onClick={() => setPreviewOpen(true)} className="block w-full">
        {image}
      </button>
      <DialogContent
        showCloseButton
        onClick={() => setPreviewOpen(false)}
        className="inset-0 z-[70] block h-screen max-h-none w-screen max-w-none translate-x-0 translate-y-0 gap-0 rounded-none border-none bg-black p-0 sm:max-w-none [&>button]:z-10 [&>button]:text-white"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{banner.name}</DialogTitle>
          <DialogDescription>Tampilan penuh banner {banner.name}</DialogDescription>
        </DialogHeader>
        <div className="relative h-full w-full">
          <Image src={banner.image_url} alt={banner.name} fill sizes="100vw" className="object-contain" />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PromoBannerSlider() {
  const { data: banners, isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: bannerService.list,
    staleTime: 5 * 60 * 1000,
  });

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

  if (!isLoading && (!banners || banners.length === 0)) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 sm:pt-6 lg:px-8">
      {isLoading ? (
        <div className="h-40 animate-pulse rounded-2xl bg-surface sm:h-56" />
      ) : (
        <div className="relative">
          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {banners?.map((banner, index) => (
                <div key={banner.id} className="relative min-w-0 flex-[0_0_100%] px-1">
                  <BannerSlide banner={banner} priority={index === 0} />
                </div>
              ))}
            </div>
          </div>

          {(banners?.length ?? 0) > 1 && (
            <>
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
                {banners?.map((banner, index) => (
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
            </>
          )}
        </div>
      )}
    </section>
  );
}
