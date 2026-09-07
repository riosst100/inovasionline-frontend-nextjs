"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { shippingMethodService } from "@/services/shipping-method.service";
import type { ShippingMethodPayload } from "@/types/shipping-method";
import type { ShippingRateRowPayload } from "@/types/shipping-rate";

export const SHIPPING_METHODS_QUERY_KEY = ["seller", "shipping-methods"] as const;

export function useShippingMethods() {
  return useQuery({
    queryKey: SHIPPING_METHODS_QUERY_KEY,
    queryFn: shippingMethodService.list,
  });
}

export function useCreateShippingMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: shippingMethodService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SHIPPING_METHODS_QUERY_KEY }),
  });
}

export function useUpdateShippingMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ShippingMethodPayload }) =>
      shippingMethodService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SHIPPING_METHODS_QUERY_KEY }),
  });
}

export function useDeleteShippingMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => shippingMethodService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SHIPPING_METHODS_QUERY_KEY }),
  });
}

export function shippingMethodRatesQueryKey(shippingMethodId: string) {
  return ["seller", "shipping-methods", shippingMethodId, "rates"] as const;
}

export function useShippingMethodRates(shippingMethodId: string) {
  return useQuery({
    queryKey: shippingMethodRatesQueryKey(shippingMethodId),
    queryFn: () => shippingMethodService.listRates(shippingMethodId),
  });
}

export function useCreateShippingMethodRate(shippingMethodId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ShippingRateRowPayload) => shippingMethodService.createRate(shippingMethodId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: shippingMethodRatesQueryKey(shippingMethodId) }),
  });
}

export function useUpdateShippingMethodRate(shippingMethodId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ rateId, fee }: { rateId: string; fee: number }) =>
      shippingMethodService.updateRate(shippingMethodId, rateId, fee),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: shippingMethodRatesQueryKey(shippingMethodId) }),
  });
}

export function useDeleteShippingMethodRate(shippingMethodId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rateId: string) => shippingMethodService.deleteRate(shippingMethodId, rateId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: shippingMethodRatesQueryKey(shippingMethodId) }),
  });
}

export function useImportShippingMethodRates(shippingMethodId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => shippingMethodService.importRates(shippingMethodId, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: shippingMethodRatesQueryKey(shippingMethodId) }),
  });
}

export function useCopyRateTemplate(shippingMethodId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (templateId: string) => shippingMethodService.copyFromTemplate(shippingMethodId, templateId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: shippingMethodRatesQueryKey(shippingMethodId) }),
  });
}

export function useAvailableRateTemplates() {
  return useQuery({
    queryKey: ["seller", "shipping-rate-templates"],
    queryFn: shippingMethodService.listAvailableTemplates,
  });
}
