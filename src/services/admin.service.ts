import { apiDelete, apiGet, apiGetPaginated, apiPost, apiPut } from "@/services/api-client";
import type {
  AdminSellerApplicationListParams,
  AdminUserListParams,
  PaginatedResult,
} from "@/types/admin";
import type { SellerApplication, User } from "@/types/auth";
import type { FlashSaleSlot, FlashSaleSlotPayload } from "@/types/flash-sale-slot";

export const adminService = {
  listCustomers: (params: AdminUserListParams = {}) =>
    apiGetPaginated<User>("/admin/users", { params }),

  listSellerApplications: (params: AdminSellerApplicationListParams = {}) =>
    apiGetPaginated<SellerApplication>("/admin/seller-applications", { params }),

  approveSellerApplication: (id: string) =>
    apiPost<SellerApplication>(`/admin/seller-applications/${id}/approve`),

  rejectSellerApplication: (id: string, reason: string) =>
    apiPost<SellerApplication>(`/admin/seller-applications/${id}/reject`, { reason }),

  listFlashSaleSlots: () => apiGet<FlashSaleSlot[]>("/admin/flash-sale-slots"),

  createFlashSaleSlot: (payload: FlashSaleSlotPayload) =>
    apiPost<FlashSaleSlot>("/admin/flash-sale-slots", payload),

  updateFlashSaleSlot: (id: string, payload: FlashSaleSlotPayload) =>
    apiPut<FlashSaleSlot>(`/admin/flash-sale-slots/${id}`, payload),

  deleteFlashSaleSlot: (id: string) => apiDelete<null>(`/admin/flash-sale-slots/${id}`),
};

export type { PaginatedResult };
