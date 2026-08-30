"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check } from "lucide-react";
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
import { adminService } from "@/services/admin.service";
import { ApiError } from "@/types/api";
import type { Category } from "@/types/product";

const QUERY_KEY = ["admin", "categories"];

function getErrorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
}

export function CategoryActions({ category }: { category: Category }) {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: () => adminService.approveCategory(category.id),
    onSuccess: () => {
      toast.success("Kategori disetujui.");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  if (category.is_active) {
    return <span className="text-sm text-muted-foreground">-</span>;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" size="sm" variant="outline" className="gap-1.5">
          <Check className="h-3.5 w-3.5" />
          Setujui
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Setujui kategori ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Kategori &ldquo;{category.name}&rdquo; akan aktif dan dapat digunakan pada produk.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={() => approveMutation.mutate()} disabled={approveMutation.isPending}>
            Setujui
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
