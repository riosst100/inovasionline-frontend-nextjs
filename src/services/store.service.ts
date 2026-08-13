import { apiGet } from "@/services/api-client";
import type { PublicStore, StoreSort } from "@/types/product";

interface ListStoresParams {
  sort: StoreSort;
  cityCode?: string;
  limit?: number;
}

export const storeService = {
  list: ({ sort, cityCode, limit = 12 }: ListStoresParams) =>
    apiGet<PublicStore[]>("/stores", { params: { sort, city_code: cityCode, limit } }),
};
