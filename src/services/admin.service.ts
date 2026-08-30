import { apiDelete, apiGet, apiGetPaginated, apiPost, apiPut } from "@/services/api-client";
import type {
  AdminCategoryListParams,
  AdminSellerApplicationListParams,
  AdminUserListParams,
  AdminVerificationListParams,
  PaginatedResult,
} from "@/types/admin";
import type { SellerApplication, User, UserVerification } from "@/types/auth";
import type { Banner, BannerPayload } from "@/types/banner";
import type { FlashSaleSlot, FlashSaleSlotPayload } from "@/types/flash-sale-slot";
import type { Category, CategoryPayload } from "@/types/product";

function toBannerFormData(payload: BannerPayload): FormData {
  const formData = new FormData();

  formData.append("name", payload.name);
  if (payload.is_active !== undefined) {
    formData.append("is_active", payload.is_active ? "1" : "0");
  }
  if (payload.image) {
    formData.append("image", payload.image);
  }
  if (payload.link_url !== undefined) {
    formData.append("link_url", payload.link_url);
  }

  return formData;
}

export const adminService = {
  listCustomers: (params: AdminUserListParams = {}) =>
    apiGetPaginated<User>("/admin/users", { params }),

  listSellerApplications: (params: AdminSellerApplicationListParams = {}) =>
    apiGetPaginated<SellerApplication>("/admin/seller-applications", { params }),

  approveSellerApplication: (id: string) =>
    apiPost<SellerApplication>(`/admin/seller-applications/${id}/approve`),

  rejectSellerApplication: (id: string, reason: string) =>
    apiPost<SellerApplication>(`/admin/seller-applications/${id}/reject`, { reason }),

  listVerifications: (params: AdminVerificationListParams = {}) =>
    apiGetPaginated<UserVerification>("/admin/verifications", { params }),

  approveVerification: (id: string) =>
    apiPost<UserVerification>(`/admin/verifications/${id}/approve`),

  rejectVerification: (id: string, reason: string) =>
    apiPost<UserVerification>(`/admin/verifications/${id}/reject`, { reason }),

  listFlashSaleSlots: () => apiGet<FlashSaleSlot[]>("/admin/flash-sale-slots"),

  createFlashSaleSlot: (payload: FlashSaleSlotPayload) =>
    apiPost<FlashSaleSlot>("/admin/flash-sale-slots", payload),

  updateFlashSaleSlot: (id: string, payload: FlashSaleSlotPayload) =>
    apiPut<FlashSaleSlot>(`/admin/flash-sale-slots/${id}`, payload),

  deleteFlashSaleSlot: (id: string) => apiDelete<null>(`/admin/flash-sale-slots/${id}`),

  listCategories: (params: AdminCategoryListParams = {}) =>
    apiGetPaginated<Category>("/admin/categories", { params }),

  createCategory: (payload: CategoryPayload) => apiPost<Category>("/admin/categories", payload),

  updateCategory: (id: string, payload: CategoryPayload) =>
    apiPut<Category>(`/admin/categories/${id}`, payload),

  approveCategory: (id: string) => apiPost<Category>(`/admin/categories/${id}/approve`),

  listBanners: () => apiGet<Banner[]>("/admin/banners"),

  createBanner: (payload: BannerPayload) =>
    apiPost<Banner>("/admin/banners", toBannerFormData(payload), {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateBanner: (id: string, payload: BannerPayload) =>
    apiPost<Banner>(`/admin/banners/${id}`, toBannerFormData(payload), {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  reorderBanners: (ids: string[]) => apiPost<null>("/admin/banners/reorder", { ids }),

  deleteBanner: (id: string) => apiDelete<null>(`/admin/banners/${id}`),
};

export type { PaginatedResult };
