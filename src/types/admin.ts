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
