"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { promotionService } from "@/services/promotion.service";

export const PROMOTIONS_QUERY_KEY = ["seller", "promotions"] as const;

export function usePromotions(page = 1) {
  return useQuery({
    queryKey: [...PROMOTIONS_QUERY_KEY, page],
    queryFn: () => promotionService.list(page),
  });
}

export function useCreatePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: promotionService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMOTIONS_QUERY_KEY });
    },
  });
}
