"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { categoryService } from "@/services/category.service";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoryList() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const { data: allCategories, isLoading } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: categoryService.list,
    staleTime: 5 * 60 * 1000,
  });

  const mainCategory = allCategories?.find((category) => category.parent_id === null);
  const categories = allCategories?.filter((category) => category.parent_id === mainCategory?.id);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 0);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, categories]);

  const scrollByAmount = (direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="grid auto-cols-max grid-flow-col grid-rows-2 gap-x-2 gap-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex w-20 flex-col items-center gap-2 sm:w-24">
            <Skeleton className="h-14 w-14 rounded-2xl sm:h-16 sm:w-16" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="-mx-4 touch-pan-x overflow-x-auto px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="grid auto-cols-max grid-flow-col grid-rows-2 gap-x-2 gap-y-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group flex w-20 flex-col items-center gap-2 sm:w-24"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface text-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary sm:h-16 sm:w-16">
                <LayoutGrid className="h-6 w-6 sm:h-7 sm:w-7" />
              </span>
              <span className="line-clamp-2 text-center text-sm font-medium text-foreground">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
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
        onClick={() => scrollByAmount(-1)}
        className={cn(
          "absolute top-1/2 left-0 flex h-8 w-8 -translate-y-1/2 -translate-x-1/2 items-center justify-center rounded-full bg-background text-foreground shadow-md ring-1 ring-border hover:bg-surface sm:h-9 sm:w-9",
          canScrollPrev ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Berikutnya"
        onClick={() => scrollByAmount(1)}
        className={cn(
          "absolute top-1/2 right-0 flex h-8 w-8 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-background text-foreground shadow-md ring-1 ring-border hover:bg-surface sm:h-9 sm:w-9",
          canScrollNext ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
