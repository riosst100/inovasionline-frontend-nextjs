"use client";

import Link from "next/link";
import { toast } from "sonner";
import { ListOrdered, Trash2 } from "lucide-react";
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
import { ShippingMethodFormDialog } from "@/features/seller/shipping-method-form-dialog";
import { useDeleteShippingMethod } from "@/features/seller/use-shipping-methods";
import { ApiError } from "@/types/api";
import type { ShippingMethod } from "@/types/shipping-method";

function getErrorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
}

export function ShippingMethodActions({ method }: { method: ShippingMethod }) {
  const deleteMethod = useDeleteShippingMethod();

  return (
    <div className="flex items-center gap-2">
      {method.rate_type === "table" && (
        <Button asChild size="icon-sm" variant="ghost">
          <Link href={`/seller/shipping-methods/${method.id}/rates`}>
            <ListOrdered className="h-3.5 w-3.5" />
          </Link>
        </Button>
      )}
      <ShippingMethodFormDialog method={method} />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button type="button" size="icon-sm" variant="ghost">
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus &ldquo;{method.name}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>Metode pengiriman ini tidak akan bisa dipilih lagi oleh pembeli.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteMethod.mutate(method.id, {
                  onSuccess: () => toast.success("Metode pengiriman dihapus."),
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
