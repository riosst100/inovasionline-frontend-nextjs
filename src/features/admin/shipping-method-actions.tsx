"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { adminService } from "@/services/admin.service";
import { ApiError } from "@/types/api";
import type { ShippingMethod } from "@/types/shipping-method";

function getErrorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
}

export function ShippingMethodActions({ method }: { method: ShippingMethod }) {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: () => adminService.toggleShippingMethod(method.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "shipping-methods"] }),
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
