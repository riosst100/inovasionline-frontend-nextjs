"use client";

import { useQuery } from "@tanstack/react-query";
import { regionService } from "@/services/region.service";

export const REGIONS_QUERY_KEY = ["regions"] as const;

const REGIONS_STALE_TIME = 7 * 24 * 60 * 60 * 1000;
const REGIONS_GC_TIME = 7 * 24 * 60 * 60 * 1000;

export function useProvinces() {
  return useQuery({
    queryKey: [...REGIONS_QUERY_KEY, "provinces"],
    queryFn: () => regionService.provinces(),
    staleTime: REGIONS_STALE_TIME,
    gcTime: REGIONS_GC_TIME,
  });
}

export function useCities(provinceCode: string | null) {
  return useQuery({
    queryKey: [...REGIONS_QUERY_KEY, "cities", provinceCode],
    queryFn: () => regionService.cities(provinceCode as string),
    staleTime: REGIONS_STALE_TIME,
    gcTime: REGIONS_GC_TIME,
    enabled: Boolean(provinceCode),
  });
}

export function useDistricts(cityCode: string | null) {
  return useQuery({
    queryKey: [...REGIONS_QUERY_KEY, "districts", cityCode],
    queryFn: () => regionService.districts(cityCode as string),
    staleTime: REGIONS_STALE_TIME,
    gcTime: REGIONS_GC_TIME,
    enabled: Boolean(cityCode),
  });
}

export function useVillages(districtCode: string | null) {
  return useQuery({
    queryKey: [...REGIONS_QUERY_KEY, "villages", districtCode],
    queryFn: () => regionService.villages(districtCode as string),
    staleTime: REGIONS_STALE_TIME,
    gcTime: REGIONS_GC_TIME,
    enabled: Boolean(districtCode),
  });
}
