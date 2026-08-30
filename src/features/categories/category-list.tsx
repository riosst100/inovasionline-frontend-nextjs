"use client";

import { Layers } from "lucide-react";
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
import { useCategories, useRootCategories } from "@/features/categories/use-categories";

export function CategoryList() {
  const { data, isLoading } = useCategories();
  const { data: rootCategories } = useRootCategories();

  const rootCategoryNames = new Map(rootCategories?.map((category) => [category.id, category.name]));

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  const categories = data?.data ?? [];

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-card p-12 text-center">
        <Layers className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Belum ada sub kategori. Ajukan sub kategori pertama Anda.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Kategori Utama</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {category.parent_id ? (rootCategoryNames.get(category.parent_id) ?? "-") : "-"}
              </TableCell>
              <TableCell className="text-muted-foreground">{category.slug}</TableCell>
              <TableCell className="max-w-xs truncate text-muted-foreground">
                {category.description ?? "-"}
              </TableCell>
              <TableCell>
                <Badge variant={category.is_active ? "default" : "secondary"}>
                  {category.is_active ? "Aktif" : "Menunggu Persetujuan"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
