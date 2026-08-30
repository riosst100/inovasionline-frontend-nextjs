"use client";

import { useState } from "react";
import { FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { UserVerification } from "@/types/auth";

export function UserVerificationDocumentsDialog({ verification }: { verification: UserVerification }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="outline" className="gap-1.5">
          <FileSearch className="h-3.5 w-3.5" />
          Lihat Dokumen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Dokumen Verifikasi</DialogTitle>
          <DialogDescription>
            Dokumen yang dikirim oleh {verification.full_name}
            {verification.id_number ? ` (NIK: ${verification.id_number})` : ""}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium">Foto Wajah</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={verification.selfie_url}
              alt="Foto wajah pengguna"
              className="w-full rounded-lg border border-border object-cover"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Dokumen Identitas</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={verification.document_url}
              alt="Dokumen identitas pengguna"
              className="w-full rounded-lg border border-border object-cover"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
