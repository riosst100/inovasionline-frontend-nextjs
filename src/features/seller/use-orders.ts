"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService, type SellerOrderListParams } from "@/services/order.service";
import type { OrderStatus } from "@/types/order";

export const SELLER_ORDERS_QUERY_KEY = ["seller", "orders"] as const;

export function useSellerOrders(params: SellerOrderListParams) {
  return useQuery({
    queryKey: [...SELLER_ORDERS_QUERY_KEY, params],
    queryFn: () => orderService.list(params),
  });
}

export function useSellerOrder(id: string) {
  return useQuery({
    queryKey: [...SELLER_ORDERS_QUERY_KEY, id],
    queryFn: () => orderService.get(id),
  });
}

export function useUpdateOrderStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ status, sellerNotes }: { status: OrderStatus; sellerNotes?: string }) =>
      orderService.updateStatus(id, status, sellerNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SELLER_ORDERS_QUERY_KEY });
    },
  });
}

export function useMarkOrderAsPaid(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => orderService.markAsPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SELLER_ORDERS_QUERY_KEY });
    },
  });
}
