"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { sellerApplicationService } from "@/services/seller-application.service";
import { useCurrentUser } from "@/features/auth/use-auth";

export const SELLER_APPLICATION_QUERY_KEY = ["seller", "application"] as const;

export function useSellerApplication() {
  const { data: user } = useCurrentUser();

  return useQuery({
    queryKey: SELLER_APPLICATION_QUERY_KEY,
    queryFn: sellerApplicationService.current,
    enabled: !!user && !user.is_seller,
    retry: false,
    throwOnError: false,
  });
}

export function useApplyAsSeller() {
  return useMutation({
    mutationFn: sellerApplicationService.apply,
  });
}
