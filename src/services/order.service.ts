import { apiGet, apiGetPaginated, apiPost } from "@/services/api-client";
import type { Order, OrderStatus } from "@/types/order";

export interface SellerOrderListParams {
  page?: number;
  status?: string;
  payment_status?: string;
}

export const orderService = {
  list: (params: SellerOrderListParams = {}) => apiGetPaginated<Order>("/seller/orders", { params }),

  get: (id: string) => apiGet<Order>(`/seller/orders/${id}`),

  updateStatus: (id: string, status: OrderStatus, sellerNotes?: string) =>
    apiPost<Order>(`/seller/orders/${id}/status`, { status, seller_notes: sellerNotes }),

  markAsPaid: (id: string) => apiPost<Order>(`/seller/orders/${id}/mark-paid`),
};
