import { apiGet } from "@/services/api-client";
import type { FlashSaleSlot } from "@/types/flash-sale-slot";

export const flashSaleSlotService = {
  list: () => apiGet<FlashSaleSlot[]>("/flash-sale-slots"),
};
