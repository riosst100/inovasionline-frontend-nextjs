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

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}
