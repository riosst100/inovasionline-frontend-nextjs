"use client";

import Image from "next/image";
import { Package } from "lucide-react";
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
import { useProducts } from "@/features/products/use-products";
import type { ProductStatus } from "@/types/product";

const STATUS_LABEL: Record<ProductStatus, string> = {
  draft: "Draf",
  active: "Aktif",
  inactive: "Nonaktif",
  out_of_stock: "Stok Habis",
  archived: "Diarsipkan",
};

const STATUS_VARIANT: Record<ProductStatus, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "secondary",
  active: "default",
  inactive: "outline",
  out_of_stock: "destructive",
  archived: "outline",
};

function formatPrice(value: string) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    Number(value)
  );
}

export function ProductList() {
  const { data, isLoading } = useProducts();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  const products = data?.data ?? [];

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-card p-12 text-center">
        <Package className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Belum ada produk. Tambahkan produk pertama Anda.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produk</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Stok</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {product.images[0] && (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <span className="font-medium">{product.name}</span>
                </div>
              </TableCell>
              <TableCell>{formatPrice(product.regular_price)}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANT[product.status]}>{STATUS_LABEL[product.status]}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
