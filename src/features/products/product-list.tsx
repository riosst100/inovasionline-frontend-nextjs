"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, Loader2, Package, Pencil, Upload } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useImportProducts, useProducts } from "@/features/products/use-products";
import { env } from "@/config/env";
import { ApiError } from "@/types/api";
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

function getErrorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
}

function ProductImportExportActions() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importProducts = useImportProducts();

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      const result = await importProducts.mutateAsync(file);
      if (result.skipped.length > 0) {
        toast.warning(`${result.imported} produk berhasil diimpor, ${result.skipped.length} baris dilewati.`, {
          description: result.skipped.slice(0, 5).map((s) => `Baris ${s.row}: ${s.reason}`).join("\n"),
        });
      } else {
        toast.success(`${result.imported} produk berhasil diimpor.`);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline">
            <Download />
            Ekspor
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <a href={`${env.apiUrl}/seller/products/export?format=csv`} target="_blank" rel="noreferrer">
              Ekspor CSV
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={`${env.apiUrl}/seller/products/export?format=xlsx`} target="_blank" rel="noreferrer">
              Ekspor XLSX
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={importProducts.isPending}>
        {importProducts.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload />}
        Impor
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls,text/csv"
        className="hidden"
        onChange={handleFileSelected}
      />
    </div>
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
      <div className="space-y-4">
        <div className="flex justify-end">
          <ProductImportExportActions />
        </div>
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-card p-12 text-center">
          <Package className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Belum ada produk. Tambahkan produk pertama Anda.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ProductImportExportActions />
      </div>
      <div className="rounded-3xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produk</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
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
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/seller/products/${product.id}/edit`}>
                      <Pencil />
                      Edit
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
