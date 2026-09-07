"use client";

import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PaymentMethodFormDialog } from "@/features/seller/payment-method-form-dialog";
import { useDeletePaymentMethod } from "@/features/seller/use-payment-methods";
import { ApiError } from "@/types/api";
import type { PaymentMethod } from "@/types/payment-method";

function getErrorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
}

export function PaymentMethodActions({ method }: { method: PaymentMethod }) {
  const deleteMethod = useDeletePaymentMethod();

  return (
    <div className="flex items-center gap-2">
      <PaymentMethodFormDialog method={method} />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button type="button" size="icon-sm" variant="ghost">
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus &ldquo;{method.name}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>Metode pembayaran ini tidak akan bisa dipilih lagi oleh pembeli.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteMethod.mutate(method.id, {
                  onSuccess: () => toast.success("Metode pembayaran dihapus."),
                  onError: (error) => toast.error(getErrorMessage(error)),
                })
              }
              disabled={deleteMethod.isPending}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
