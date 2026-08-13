"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";

export const PRODUCTS_QUERY_KEY = ["seller", "products"] as const;
export const CATEGORIES_QUERY_KEY = ["categories"] as const;

export function useProducts(page = 1) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, page],
    queryFn: () => productService.list(page),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: categoryService.list,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
}
