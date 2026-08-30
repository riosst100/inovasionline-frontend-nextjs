import { apiGet, apiGetPaginated, apiGetWithMeta, apiPost } from "@/services/api-client";
import type { Category, CategoryPayload, CategoryWithProducts } from "@/types/product";

export const categoryService = {
  list: () => apiGet<Category[]>("/categories"),
  rootList: () => apiGet<Category[]>("/categories", { params: { root_only: 1 } }),
  sellerList: (page = 1) => apiGetPaginated<Category>("/seller/categories", { params: { page } }),
  create: (payload: CategoryPayload) => apiPost<Category>("/seller/categories", payload),
  bySlug: (slug: string, page = 1) =>
    apiGetWithMeta<CategoryWithProducts>(`/categories/${slug}`, { params: { page } }),
};
