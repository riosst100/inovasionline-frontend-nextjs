"use client";

import Link from "next/link";
import { BadgeCheck, Clock, ShieldCheck, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/features/auth/use-auth";
import { useUserVerification } from "@/features/account/use-user-verification";
import { VerificationForm } from "@/features/account/verification-form";

export function VerificationGate() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: verification, isLoading: verificationLoading } = useUserVerification();

  if (userLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Masuk untuk verifikasi identitas</h2>
            <p className="text-sm text-muted-foreground">
              Anda perlu memiliki akun Inovasi Online untuk mengajukan verifikasi identitas.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/register?redirect=/account/verification">Daftar Akun</Link>
            </Button>
            <Button asChild>
              <Link href="/login?redirect=/account/verification">Masuk</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (user.is_verified) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BadgeCheck className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Akun Anda sudah terverifikasi</h2>
            <p className="text-sm text-muted-foreground">
              Identitas Anda telah diverifikasi dan badge terverifikasi kini tampil di akun Anda.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (verificationLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (verification?.status === "pending") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10 text-warning">
            <Clock className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Verifikasi sedang ditinjau</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              Dokumen yang Anda kirim sedang kami tinjau. Kami akan mengabari Anda setelah proses
              selesai, biasanya dalam 1-2 hari kerja.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        {verification?.status === "rejected" && (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-center">
            <XCircle className="h-6 w-6 text-destructive" />
            <div className="space-y-1">
              <p className="text-sm font-semibold">Verifikasi sebelumnya ditolak</p>
              {verification.rejection_reason && (
                <p className="text-sm text-muted-foreground">{verification.rejection_reason}</p>
              )}
              <p className="text-xs text-muted-foreground">Silakan ajukan ulang di bawah ini.</p>
            </div>
          </div>
        )}
        <VerificationForm />
      </CardContent>
    </Card>
  );
}
