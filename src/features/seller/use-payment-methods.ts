"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentMethodService } from "@/services/payment-method.service";
import type { PaymentMethodPayload } from "@/types/payment-method";

export const PAYMENT_METHODS_QUERY_KEY = ["seller", "payment-methods"] as const;

export function usePaymentMethods() {
  return useQuery({
    queryKey: PAYMENT_METHODS_QUERY_KEY,
    queryFn: paymentMethodService.list,
  });
}

export function useCreatePaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: paymentMethodService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEY }),
  });
}

export function useUpdatePaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PaymentMethodPayload }) =>
      paymentMethodService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEY }),
  });
}

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => paymentMethodService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEY }),
  });
}
