"use client";

import Link from "next/link";
import { Clock, Store, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSellerApplication } from "@/features/seller/use-seller-application";

export function SellerApplicationBanner() {
  const { data: application } = useSellerApplication();

  if (!application || application.status === "approved") {
    return null;
  }

  const isPending = application.status === "pending";

  if (!isPending && application.status !== "rejected") {
    return null;
  }

  const address = [application.city, application.province].filter(Boolean).join(", ");

  return (
    <div className="mx-auto max-w-7xl px-2 pt-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Store className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-semibold">{application.store_name}</p>
              {isPending ? (
                <Badge className="gap-1 bg-warning/15 text-warning-foreground hover:bg-warning/15">
                  <Clock className="h-3 w-3" />
                  Sedang ditinjau
                </Badge>
              ) : (
                <Badge className="gap-1 bg-destructive/15 text-destructive hover:bg-destructive/15">
                  <XCircle className="h-3 w-3" />
                  Ditolak
                </Badge>
              )}
            </div>
            {address && <p className="truncate text-sm text-muted-foreground">{address}</p>}
          </div>
        </div>

        {isPending ? (
          <Button variant="outline" asChild className="shrink-0">
            <Link href="/seller/dashboard">Masuk ke Dashboard</Link>
          </Button>
        ) : (
          <Button variant="outline" asChild className="shrink-0">
            <Link href="/become-a-seller">Lihat Detail</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
