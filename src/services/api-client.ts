import axios, { type AxiosInstance, type AxiosRequestConfig, isAxiosError } from "axios";
import { env } from "@/config/env";
import { ApiError, type ApiErrorResponse, type ApiSuccessResponse } from "@/types/api";

function getAppOrigin(): string {
  return env.apiUrl.replace(/\/api\/v1\/?$/, "");
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

let csrfInitialized = false;

async function ensureCsrfCookie(): Promise<void> {
  if (csrfInitialized) return;
  await axios.get(`${getAppOrigin()}/sanctum/csrf-cookie`, { withCredentials: true });
  csrfInitialized = true;
}

apiClient.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase();
  if (method && method !== "get") {
    await ensureCsrfCookie();
    const token = readCookie("XSRF-TOKEN");
    if (token) {
      config.headers.set("X-XSRF-TOKEN", token);
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError<ApiErrorResponse>(error)) {
      if (error.response?.status === 419) {
        csrfInitialized = false;
      }

      const message = error.response?.data?.message ?? error.message ?? "Something went wrong.";
      const errors = error.response?.data?.errors;
      throw new ApiError(message, error.response?.status ?? 0, errors);
    }

    throw error;
  }
);

export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await apiClient.get<ApiSuccessResponse<T>>(url, config);
  return data.data;
}

export async function apiPost<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await apiClient.post<ApiSuccessResponse<T>>(url, body, config);
  return data.data;
}

export async function apiPut<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await apiClient.put<ApiSuccessResponse<T>>(url, body, config);
  return data.data;
}

export async function apiPatch<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await apiClient.patch<ApiSuccessResponse<T>>(url, body, config);
  return data.data;
}

export async function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await apiClient.delete<ApiSuccessResponse<T>>(url, config);
  return data.data;
}
