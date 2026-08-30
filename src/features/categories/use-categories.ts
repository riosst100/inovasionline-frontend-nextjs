"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";

export const CATEGORIES_QUERY_KEY = ["seller", "categories"] as const;
export const ROOT_CATEGORIES_QUERY_KEY = ["categories", "root"] as const;

export function useCategories(page = 1) {
  return useQuery({
    queryKey: [...CATEGORIES_QUERY_KEY, page],
    queryFn: () => categoryService.sellerList(page),
  });
}

export function useRootCategories() {
  return useQuery({
    queryKey: ROOT_CATEGORIES_QUERY_KEY,
    queryFn: categoryService.rootList,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
}
