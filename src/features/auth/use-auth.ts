"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { ApiError } from "@/types/api";
import type { LoginPayload, RegisterPayload, UpdateProfilePayload } from "@/types/auth";

export const AUTH_QUERY_KEY = ["auth", "user"] as const;

export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authService.currentUser,
    retry: false,
    staleTime: 60_000,
    throwOnError: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => authService.updateProfile(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      toast.success("Anda telah keluar.");
      router.push("/");
      router.refresh();
    },
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : "Gagal keluar. Silakan coba lagi.";
      toast.error(message);
    },
  });
}

export function isUnauthenticated(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}
