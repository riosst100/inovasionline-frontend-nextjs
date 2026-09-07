"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { adminService } from "@/services/admin.service";
import { ApiError } from "@/types/api";
import type { PaymentMethod } from "@/types/payment-method";

function getErrorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
}

export function PaymentMethodActions({ method }: { method: PaymentMethod }) {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: () => adminService.togglePaymentMethod(method.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "payment-methods"] }),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <Switch
      checked={method.is_enabled}
      onCheckedChange={() => toggleMutation.mutate()}
      disabled={toggleMutation.isPending}
    />
  );
}
