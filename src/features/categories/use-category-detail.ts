"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";

export function useCategoryDetail(slug: string, page = 1) {
  return useQuery({
    queryKey: ["categories", "detail", slug, page],
    queryFn: () => categoryService.bySlug(slug, page),
    staleTime: 60 * 1000,
  });
}
