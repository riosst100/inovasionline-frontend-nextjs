import { apiDelete, apiGet, apiPost, apiPut } from "@/services/api-client";
import type { PaymentMethod, PaymentMethodPayload } from "@/types/payment-method";

export const paymentMethodService = {
  list: () => apiGet<PaymentMethod[]>("/seller/payment-methods"),

  create: (payload: PaymentMethodPayload) => apiPost<PaymentMethod>("/seller/payment-methods", payload),

  update: (id: string, payload: PaymentMethodPayload) =>
    apiPut<PaymentMethod>(`/seller/payment-methods/${id}`, payload),

  remove: (id: string) => apiDelete<null>(`/seller/payment-methods/${id}`),
};
