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
import { ShippingRateTemplateFormDialog } from "@/features/admin/shipping-rate-template-form-dialog";
import { useDeleteShippingRateTemplate } from "@/features/admin/use-shipping-rate-templates";
import { ApiError } from "@/types/api";
import type { ShippingRateTemplate } from "@/types/shipping-rate";

function getErrorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
}

export function ShippingRateTemplateActions({ template }: { template: ShippingRateTemplate }) {
  const deleteTemplate = useDeleteShippingRateTemplate();

  return (
    <div className="flex items-center gap-2">
      <Button asChild size="icon-sm" variant="ghost">
        <Link href={`/admin/shipping-rate-templates/${template.id}`}>
          <ListOrdered className="h-3.5 w-3.5" />
        </Link>
      </Button>
      <ShippingRateTemplateFormDialog template={template} />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button type="button" size="icon-sm" variant="ghost">
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus template &ldquo;{template.name}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              Seluruh baris tarif dalam template ini akan ikut terhapus. Shipping method yang sudah menyalin tarif ini tidak akan terpengaruh.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteTemplate.mutate(template.id, {
                  onSuccess: () => toast.success("Template berhasil dihapus."),
                  onError: (error) => toast.error(getErrorMessage(error)),
                })
              }
              disabled={deleteTemplate.isPending}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
