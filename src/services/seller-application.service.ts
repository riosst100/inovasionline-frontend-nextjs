import { apiGet, apiPost } from "@/services/api-client";
import type { SellerApplication, SellerApplicationPayload } from "@/types/auth";

export const sellerApplicationService = {
  apply: (payload: SellerApplicationPayload) =>
    apiPost<SellerApplication>("/seller-applications", payload),
  current: () => apiGet<SellerApplication>("/seller-applications/me"),
};
