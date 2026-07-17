import { apiGet, apiPost } from "@/services/api-client";
import type {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  User,
} from "@/types/auth";

export const authService = {
  register: (payload: RegisterPayload) => apiPost<User>("/auth/register", payload),
  login: (payload: LoginPayload) => apiPost<User>("/auth/login", payload),
  logout: () => apiPost<null>("/auth/logout"),
  currentUser: () => apiGet<User>("/auth/user"),
  forgotPassword: (payload: ForgotPasswordPayload) => apiPost<null>("/auth/forgot-password", payload),
  resetPassword: (payload: ResetPasswordPayload) => apiPost<null>("/auth/reset-password", payload),
};
