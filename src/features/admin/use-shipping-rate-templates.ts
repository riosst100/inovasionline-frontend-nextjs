"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { shippingRateTemplateService } from "@/services/shipping-rate-template.service";
import type { ShippingRateRowPayload, ShippingRateTemplatePayload } from "@/types/shipping-rate";

export const SHIPPING_RATE_TEMPLATES_QUERY_KEY = ["admin", "shipping-rate-templates"] as const;

export function useShippingRateTemplates() {
  return useQuery({
    queryKey: SHIPPING_RATE_TEMPLATES_QUERY_KEY,
    queryFn: shippingRateTemplateService.list,
  });
}

export function useCreateShippingRateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: shippingRateTemplateService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SHIPPING_RATE_TEMPLATES_QUERY_KEY }),
  });
}

export function useUpdateShippingRateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ShippingRateTemplatePayload }) =>
      shippingRateTemplateService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SHIPPING_RATE_TEMPLATES_QUERY_KEY }),
  });
}

export function useDeleteShippingRateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => shippingRateTemplateService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SHIPPING_RATE_TEMPLATES_QUERY_KEY }),
  });
}

export function shippingRateTemplateRowsQueryKey(templateId: string) {
  return ["admin", "shipping-rate-templates", templateId, "rows"] as const;
}

export function useShippingRateTemplateRows(templateId: string) {
  return useQuery({
    queryKey: shippingRateTemplateRowsQueryKey(templateId),
    queryFn: () => shippingRateTemplateService.listRows(templateId),
  });
}

export function useCreateShippingRateTemplateRow(templateId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ShippingRateRowPayload) => shippingRateTemplateService.createRow(templateId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shippingRateTemplateRowsQueryKey(templateId) });
      queryClient.invalidateQueries({ queryKey: SHIPPING_RATE_TEMPLATES_QUERY_KEY });
    },
  });
}

export function useUpdateShippingRateTemplateRow(templateId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ rowId, fee }: { rowId: string; fee: number }) =>
      shippingRateTemplateService.updateRow(templateId, rowId, fee),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: shippingRateTemplateRowsQueryKey(templateId) }),
  });
}

export function useDeleteShippingRateTemplateRow(templateId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rowId: string) => shippingRateTemplateService.deleteRow(templateId, rowId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shippingRateTemplateRowsQueryKey(templateId) });
      queryClient.invalidateQueries({ queryKey: SHIPPING_RATE_TEMPLATES_QUERY_KEY });
    },
  });
}

export function useImportShippingRateTemplateRows(templateId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => shippingRateTemplateService.importRows(templateId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shippingRateTemplateRowsQueryKey(templateId) });
      queryClient.invalidateQueries({ queryKey: SHIPPING_RATE_TEMPLATES_QUERY_KEY });
    },
  });
}
