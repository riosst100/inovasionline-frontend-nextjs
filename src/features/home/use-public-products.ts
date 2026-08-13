"use client";

import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";

export const FLASH_SALE_QUERY_KEY = ["products", "flash-sale"] as const;
export const BEST_SELLERS_QUERY_KEY = ["products", "best-sellers"] as const;
export const PRODUCT_DETAIL_QUERY_KEY = ["products", "detail"] as const;

export function useFlashSaleSchedule(date?: string) {
  return useQuery({
    queryKey: [...FLASH_SALE_QUERY_KEY, date ?? null],
    queryFn: () => productService.flashSale(date),
    staleTime: 60 * 1000,
  });
}

export function useBestSellerProducts(limit = 12) {
  return useQuery({
    queryKey: [...BEST_SELLERS_QUERY_KEY, limit],
    queryFn: () => productService.bestSellers(limit),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductDetail(slug: string) {
  return useQuery({
    queryKey: [...PRODUCT_DETAIL_QUERY_KEY, slug],
    queryFn: () => productService.detail(slug),
    staleTime: 60 * 1000,
    enabled: Boolean(slug),
  });
}
