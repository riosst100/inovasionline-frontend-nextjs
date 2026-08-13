"use client";

import { useQuery } from "@tanstack/react-query";
import { storeService } from "@/services/store.service";
import { useSelectedLocation } from "@/features/location/use-selected-location";
import type { StoreSort } from "@/types/product";

export const STORES_QUERY_KEY = ["stores"] as const;

export function usePublicStores(sort: StoreSort, limit = 12) {
  const { location } = useSelectedLocation();
  const isNearest = sort === "nearest";
  const cityCode = location?.cityCode;

  const query = useQuery({
    queryKey: [...STORES_QUERY_KEY, sort, limit, cityCode],
    queryFn: () => storeService.list({ sort, cityCode, limit }),
    staleTime: 5 * 60 * 1000,
    enabled: isNearest ? Boolean(cityCode) : true,
  });

  return {
    ...query,
    noLocation: isNearest && !cityCode,
  };
}
