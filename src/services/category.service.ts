import { apiGet } from "@/services/api-client";
import type { Category } from "@/types/product";

export const categoryService = {
  list: () => apiGet<Category[]>("/categories"),
};
