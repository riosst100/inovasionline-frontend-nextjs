"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { userVerificationService } from "@/services/user-verification.service";
import { useCurrentUser } from "@/features/auth/use-auth";

export const USER_VERIFICATION_QUERY_KEY = ["account", "verification"] as const;

export function useUserVerification() {
  const { data: user } = useCurrentUser();

  return useQuery({
    queryKey: USER_VERIFICATION_QUERY_KEY,
    queryFn: userVerificationService.current,
    enabled: !!user && !user.is_verified,
    retry: false,
    throwOnError: false,
  });
}

export function useSubmitVerification() {
  return useMutation({
    mutationFn: userVerificationService.submit,
  });
}
