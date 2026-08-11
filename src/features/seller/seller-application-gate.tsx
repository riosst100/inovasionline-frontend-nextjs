"use client";

import Link from "next/link";
import { CheckCircle2, Clock, Store, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/features/auth/use-auth";
import { useSellerApplication } from "@/features/seller/use-seller-application";
import { SellerApplicationForm } from "@/features/seller/seller-application-form";

export function SellerApplicationGate() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: application, isLoading: applicationLoading } = useSellerApplication();

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
            <Store className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Masuk untuk mendaftar sebagai seller</h2>
            <p className="text-sm text-muted-foreground">
              Anda perlu memiliki akun Inovasi Online untuk mengajukan diri menjadi seller.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/register?redirect=/become-a-seller">Daftar Akun</Link>
            </Button>
            <Button asChild>
              <Link href="/login?redirect=/become-a-seller">Masuk</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (user.is_seller) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Anda sudah menjadi seller</h2>
            <p className="text-sm text-muted-foreground">Kelola toko Anda melalui Seller Center.</p>
          </div>
          <Button asChild>
            <Link href="/seller/dashboard">Buka Seller Center</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (applicationLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (application?.status === "pending") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10 text-warning">
            <Clock className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Pengajuan sedang ditinjau</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              Pengajuan toko &ldquo;{application.store_name}&rdquo; sedang kami tinjau. Kami akan mengabari
              Anda melalui email setelah proses selesai, biasanya dalam 1-2 hari kerja.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (application?.status === "rejected") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <XCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Pengajuan sebelumnya ditolak</h2>
            {application.rejection_reason && (
              <p className="max-w-sm text-sm text-muted-foreground">{application.rejection_reason}</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <SellerApplicationForm />
      </CardContent>
    </Card>
  );
}
