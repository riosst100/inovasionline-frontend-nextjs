import { apiGet } from "@/services/api-client";
import type { Region } from "@/types/region";

export const regionService = {
  provinces: () => apiGet<Region[]>("/regions/provinces"),
  cities: (provinceCode: string) => apiGet<Region[]>(`/regions/provinces/${provinceCode}/cities`),
  districts: (cityCode: string) => apiGet<Region[]>(`/regions/cities/${cityCode}/districts`),
  villages: (districtCode: string) => apiGet<Region[]>(`/regions/districts/${districtCode}/villages`),
};
