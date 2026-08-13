"use client";

import { useQuery } from "@tanstack/react-query";
import { flashSaleSlotService } from "@/services/flash-sale-slot.service";

export const FLASH_SALE_SLOTS_QUERY_KEY = ["flash-sale-slots"] as const;

export function useFlashSaleSlots() {
  return useQuery({
    queryKey: FLASH_SALE_SLOTS_QUERY_KEY,
    queryFn: flashSaleSlotService.list,
    staleTime: 5 * 60 * 1000,
  });
}
