import { apiGet, apiGetPaginated, apiPost } from "@/services/api-client";
import type {
  FlashSaleSchedule,
  Product,
  ProductImportResult,
  ProductPayload,
  PublicProduct,
  PublicProductDetail,
} from "@/types/product";

function toFormData(payload: ProductPayload): FormData {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (key === "images" || key === "existing_images" || value === undefined || value === null) return;
    formData.append(key, typeof value === "boolean" ? (value ? "1" : "0") : String(value));
  });

  payload.images?.forEach((file) => formData.append("images[]", file));
  payload.existing_images?.forEach((id) => formData.append("existing_images[]", id));

  return formData;
}

export const productService = {
  list: (page = 1) => apiGetPaginated<Product>("/seller/products", { params: { page } }),
  create: (payload: ProductPayload) =>
    apiPost<Product>("/seller/products", toFormData(payload), {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  sellerDetail: (id: string) => apiGet<Product>(`/seller/products/${id}`),
  update: (id: string, payload: ProductPayload) =>
    apiPost<Product>(`/seller/products/${id}`, toFormData(payload), {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  import: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiPost<ProductImportResult>("/seller/products/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  flashSale: (date?: string) => apiGet<FlashSaleSchedule>("/products/flash-sale", { params: date ? { date } : undefined }),
  bestSellers: (limit = 12) => apiGet<PublicProduct[]>("/products/best-sellers", { params: { limit } }),
  detail: (slug: string) => apiGet<PublicProductDetail>(`/products/${slug}`),
};
