import { apiDelete, apiGet, apiPost, apiPut } from "@/services/api-client";
import type {
  RateImportResult,
  ShippingMethodRate,
  ShippingRateRowPayload,
  ShippingRateTemplate,
} from "@/types/shipping-rate";
import type { ShippingMethod, ShippingMethodPayload } from "@/types/shipping-method";

export const shippingMethodService = {
  list: () => apiGet<ShippingMethod[]>("/seller/shipping-methods"),

  create: (payload: ShippingMethodPayload) => apiPost<ShippingMethod>("/seller/shipping-methods", payload),

  update: (id: string, payload: ShippingMethodPayload) =>
    apiPut<ShippingMethod>(`/seller/shipping-methods/${id}`, payload),

  remove: (id: string) => apiDelete<null>(`/seller/shipping-methods/${id}`),

  listRates: (shippingMethodId: string) =>
    apiGet<ShippingMethodRate[]>(`/seller/shipping-methods/${shippingMethodId}/rates`),

  createRate: (shippingMethodId: string, payload: ShippingRateRowPayload) =>
    apiPost<ShippingMethodRate>(`/seller/shipping-methods/${shippingMethodId}/rates`, payload),

  updateRate: (shippingMethodId: string, rateId: string, fee: number) =>
    apiPut<ShippingMethodRate>(`/seller/shipping-methods/${shippingMethodId}/rates/${rateId}`, { fee }),

  deleteRate: (shippingMethodId: string, rateId: string) =>
    apiDelete<null>(`/seller/shipping-methods/${shippingMethodId}/rates/${rateId}`),

  exportRatesUrl: (shippingMethodId: string) => `/seller/shipping-methods/${shippingMethodId}/rates/export`,

  importRates: (shippingMethodId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiPost<RateImportResult>(`/seller/shipping-methods/${shippingMethodId}/rates/import`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  copyFromTemplate: (shippingMethodId: string, templateId: string) =>
    apiPost<{ copied: number }>(`/seller/shipping-methods/${shippingMethodId}/rates/copy-template`, {
      shipping_rate_template_id: templateId,
    }),

  listAvailableTemplates: () => apiGet<ShippingRateTemplate[]>("/seller/shipping-rate-templates"),
};
