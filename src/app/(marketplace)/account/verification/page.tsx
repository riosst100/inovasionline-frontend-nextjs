import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { VerificationGate } from "@/features/account/verification-gate";

export const metadata: Metadata = {
  title: "Verifikasi Identitas",
};

export default function VerificationPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-2 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-md shadow-accent/30">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Verifikasi Identitas</h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          Verifikasi identitas Anda dengan foto wajah dan dokumen KTP untuk mendapatkan badge
          terverifikasi.
        </p>
      </div>

      <VerificationGate />
    </div>
  );
}
