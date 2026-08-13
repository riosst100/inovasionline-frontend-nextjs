"use client";

import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePromotions } from "@/features/promotions/use-promotions";
import type { PromotionType } from "@/types/promotion";

const TYPE_LABEL: Record<PromotionType, string> = {
  percentage_discount: "Diskon Persentase",
  fixed_discount: "Diskon Nominal",
  free_shipping: "Gratis Ongkir",
  buy_one_get_one: "Beli 1 Gratis 1",
};

function formatDiscount(type: PromotionType, value: string | null) {
  if (!value) return "-";
  if (type === "percentage_discount") return `${Number(value)}%`;
  if (type === "fixed_discount") {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
      Number(value)
    );
  }
  return "-";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function PromotionList() {
  const { data, isLoading } = usePromotions();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  const promotions = data?.data ?? [];

  if (promotions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-card p-12 text-center">
        <Tag className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Belum ada flash sale. Buat flash sale pertama Anda.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Diskon</TableHead>
            <TableHead>Produk</TableHead>
            <TableHead>Slot</TableHead>
            <TableHead>Periode</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promotions.map((promotion) => (
            <TableRow key={promotion.id}>
              <TableCell className="font-medium">{promotion.name}</TableCell>
              <TableCell>{TYPE_LABEL[promotion.type]}</TableCell>
              <TableCell>{formatDiscount(promotion.type, promotion.discount_value)}</TableCell>
              <TableCell>{promotion.products.length} produk</TableCell>
              <TableCell>{promotion.flash_sale_slot?.label ?? "-"}</TableCell>
              <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                {formatDate(promotion.starts_at)} - {formatDate(promotion.ends_at)}
              </TableCell>
              <TableCell>
                <Badge variant={promotion.is_currently_active ? "default" : "secondary"}>
                  {promotion.is_currently_active ? "Berlangsung" : promotion.is_active ? "Terjadwal" : "Nonaktif"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
