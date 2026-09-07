export interface PaginatedMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginatedMeta;
}

export interface AdminUserListParams {
  page?: number;
  search?: string;
  role?: string;
}

export interface AdminSellerApplicationListParams {
  page?: number;
  status?: string;
}

export interface AdminVerificationListParams {
  page?: number;
  status?: string;
}

export interface AdminCategoryListParams {
  page?: number;
  status?: string;
  per_page?: number;
}

export interface AdminOrderListParams {
  page?: number;
  store_id?: string;
  status?: string;
  payment_status?: string;
}

export interface AdminPaymentMethodListParams {
  page?: number;
  store_id?: string;
  is_enabled?: boolean;
}

export interface AdminShippingMethodListParams {
  page?: number;
  store_id?: string;
  is_enabled?: boolean;
}
