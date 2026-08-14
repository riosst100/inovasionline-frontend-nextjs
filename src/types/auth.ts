export type UserRole = "customer" | "seller_owner" | "seller_staff" | "platform_admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  is_seller: boolean;
  email_verified_at: string | null;
  created_at: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  terms_agreed: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

export interface UpdateProfilePayload {
  name: string;
  phone: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export type SellerApplicationStatus = "pending" | "approved" | "rejected" | "suspended";

export interface SellerApplicationPayload {
  full_name: string;
  email: string;
  phone: string;
  store_name: string;
  business_type: "individual" | "company";
  business_description?: string;
  address: string;
  province: string;
  city: string;
  district?: string;
  postal_code?: string;
}

export interface SellerApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  store_name: string;
  store_slug: string;
  business_type: "individual" | "company";
  main_category_id: string | null;
  business_description: string | null;
  address: string;
  province: string;
  city: string;
  district: string | null;
  postal_code: string | null;
  status: SellerApplicationStatus;
  rejection_reason: string | null;
  created_at: string;
}
