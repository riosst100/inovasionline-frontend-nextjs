"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
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
import type { FlashSaleSlot } from "@/types/flash-sale-slot";

const FLASH_SALE_SLOTS_QUERY_KEY = ["admin", "flash-sale-slots"];

function getErrorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
}

export function FlashSaleSlotActions({ slot }: { slot: FlashSaleSlot }) {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: (is_active: boolean) =>
      adminService.updateFlashSaleSlot(slot.id, {
        label: slot.label,
        start_time: slot.start_time,
        end_time: slot.end_time,
        is_active,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FLASH_SALE_SLOTS_QUERY_KEY }),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: () => adminService.deleteFlashSaleSlot(slot.id),
    onSuccess: () => {
      toast.success("Slot berhasil dihapus.");
      queryClient.invalidateQueries({ queryKey: FLASH_SALE_SLOTS_QUERY_KEY });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <div className="flex items-center gap-3">
      <Switch
        checked={slot.is_active}
        onCheckedChange={(checked) => toggleMutation.mutate(checked)}
        disabled={toggleMutation.isPending}
      />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button type="button" size="icon-sm" variant="ghost">
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus slot &ldquo;{slot.label}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              Slot yang sudah dipakai oleh flash sale seller tidak akan terhapus dari promosi yang sudah berjalan,
              tapi tidak bisa dipilih lagi untuk flash sale baru.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
