import { apiGetPaginated, apiPost } from "@/services/api-client";
import type { Promotion, PromotionPayload } from "@/types/promotion";

export const promotionService = {
  list: (page = 1) => apiGetPaginated<Promotion>("/seller/promotions", { params: { page } }),
  create: (payload: PromotionPayload) => apiPost<Promotion>("/seller/promotions", payload),
};
