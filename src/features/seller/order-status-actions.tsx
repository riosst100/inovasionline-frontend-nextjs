"use client";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";
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
import { useMarkOrderAsPaid, useUpdateOrderStatus } from "@/features/seller/use-orders";
import { ApiError } from "@/types/api";
import type { Order, OrderStatus } from "@/types/order";

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["accepted", "cancelled"],
  accepted: ["processing", "cancelled"],
  processing: ["ready", "cancelled"],
  ready: ["completed"],
  completed: [],
  cancelled: [],
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Menunggu",
  accepted: "Terima Pesanan",
  processing: "Proses Pesanan",
  ready: "Tandai Siap",
  completed: "Selesaikan Pesanan",
  cancelled: "Batalkan Pesanan",
};

function getErrorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
}

export function OrderStatusActions({ order }: { order: Order }) {
  const updateStatus = useUpdateOrderStatus(order.id);
  const markAsPaid = useMarkOrderAsPaid(order.id);
  const nextStatuses = TRANSITIONS[order.status];

  function handleTransition(status: OrderStatus) {
    updateStatus.mutate(
      { status },
      {
        onSuccess: () => toast.success("Status pesanan berhasil diperbarui."),
        onError: (error) => toast.error(getErrorMessage(error)),
      }
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {order.payment_status === "unpaid" && (
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            markAsPaid.mutate(undefined, {
              onSuccess: () => toast.success("Pesanan ditandai sudah dibayar."),
              onError: (error) => toast.error(getErrorMessage(error)),
            })
          }
          disabled={markAsPaid.isPending}
        >
          {markAsPaid.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Tandai Sudah Dibayar
        </Button>
      )}

      {nextStatuses
        .filter((status) => status !== "cancelled")
        .map((status) => (
          <Button key={status} type="button" onClick={() => handleTransition(status)} disabled={updateStatus.isPending}>
            {updateStatus.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {STATUS_LABEL[status]}
          </Button>
        ))}

      {nextStatuses.includes("cancelled") && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="button" variant="outline" className="text-destructive">
              Batalkan Pesanan
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Batalkan pesanan ini?</AlertDialogTitle>
              <AlertDialogDescription>Stok produk akan dikembalikan secara otomatis.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleTransition("cancelled")} disabled={updateStatus.isPending}>
                Ya, Batalkan
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
