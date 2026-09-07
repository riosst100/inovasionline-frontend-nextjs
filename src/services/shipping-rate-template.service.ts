import { apiDelete, apiGet, apiPost, apiPut } from "@/services/api-client";
import type {
  RateImportResult,
  ShippingRateRowPayload,
  ShippingRateTemplate,
  ShippingRateTemplatePayload,
  ShippingRateTemplateRow,
} from "@/types/shipping-rate";

export const shippingRateTemplateService = {
  list: () => apiGet<ShippingRateTemplate[]>("/admin/shipping-rate-templates"),

  create: (payload: ShippingRateTemplatePayload) =>
    apiPost<ShippingRateTemplate>("/admin/shipping-rate-templates", payload),

  update: (id: string, payload: ShippingRateTemplatePayload) =>
    apiPut<ShippingRateTemplate>(`/admin/shipping-rate-templates/${id}`, payload),

  remove: (id: string) => apiDelete<null>(`/admin/shipping-rate-templates/${id}`),

  listRows: (templateId: string) =>
    apiGet<ShippingRateTemplateRow[]>(`/admin/shipping-rate-templates/${templateId}/rows`),

  createRow: (templateId: string, payload: ShippingRateRowPayload) =>
    apiPost<ShippingRateTemplateRow>(`/admin/shipping-rate-templates/${templateId}/rows`, payload),

  updateRow: (templateId: string, rowId: string, fee: number) =>
    apiPut<ShippingRateTemplateRow>(`/admin/shipping-rate-templates/${templateId}/rows/${rowId}`, { fee }),

  deleteRow: (templateId: string, rowId: string) =>
    apiDelete<null>(`/admin/shipping-rate-templates/${templateId}/rows/${rowId}`),

  exportRowsUrl: (templateId: string) => `/admin/shipping-rate-templates/${templateId}/rows/export`,

  importRows: (templateId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiPost<RateImportResult>(`/admin/shipping-rate-templates/${templateId}/rows/import`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
