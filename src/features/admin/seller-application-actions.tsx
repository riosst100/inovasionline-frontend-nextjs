"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { adminService } from "@/services/admin.service";
import { ApiError } from "@/types/api";
import type { SellerApplication } from "@/types/auth";

const QUERY_KEY = ["admin", "seller-applications"];

function getErrorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
}

export function SellerApplicationActions({ application }: { application: SellerApplication }) {
  const queryClient = useQueryClient();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");

  const approveMutation = useMutation({
    mutationFn: () => adminService.approveSellerApplication(application.id),
    onSuccess: () => {
      toast.success("Pengajuan seller disetujui.");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const rejectMutation = useMutation({
    mutationFn: () => adminService.rejectSellerApplication(application.id, reason),
    onSuccess: () => {
      toast.success("Pengajuan seller ditolak.");
      setRejectOpen(false);
      setReason("");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  if (application.status !== "pending") {
    return <span className="text-sm text-muted-foreground">-</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button type="button" size="sm" variant="outline" className="gap-1.5">
            <Check className="h-3.5 w-3.5" />
            Setujui
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Setujui pengajuan seller?</AlertDialogTitle>
            <AlertDialogDescription>
              Toko &ldquo;{application.store_name}&rdquo; akan aktif dan pemiliknya akan berubah menjadi
              seller.
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

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogTrigger asChild>
          <Button type="button" size="sm" variant="destructive" className="gap-1.5">
            <X className="h-3.5 w-3.5" />
            Tolak
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tolak pengajuan seller</DialogTitle>
            <DialogDescription>
              Berikan alasan penolakan untuk toko &ldquo;{application.store_name}&rdquo;.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Alasan penolakan..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              disabled={!reason.trim() || rejectMutation.isPending}
              onClick={() => rejectMutation.mutate()}
            >
              Tolak Pengajuan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
