"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/data-table/data-table";
import { CategoryActions } from "@/features/admin/category-actions";
import { CategoryFormDialog } from "@/features/admin/category-form-dialog";
import { adminService } from "@/services/admin.service";
import type { Category } from "@/types/product";

const subCategoryColumns: DataTableColumn<Category>[] = [
  { id: "name", header: "Nama", cell: (row) => <span className="font-medium">{row.name}</span> },
  { id: "slug", header: "Slug", cell: (row) => <span className="text-muted-foreground">{row.slug}</span> },
  {
    id: "status",
    header: "Status",
    cell: (row) => (
      <Badge variant={row.is_active ? "default" : "secondary"}>
        {row.is_active ? "Aktif" : "Menunggu Persetujuan"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: (row) => (
      <div className="flex items-center gap-2">
        <CategoryFormDialog category={row} />
        <CategoryActions category={row} />
      </div>
    ),
  },
];

// Ambil seluruh kategori sekaligus (bukan per halaman) supaya pengelompokan
// berdasarkan kategori utama konsisten di seluruh data, bukan hanya per halaman.
const ALL_CATEGORIES_PER_PAGE = 500;

export default function AdminCategoriesPage() {
  const [status, setStatus] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "categories", "grouped", { status }],
    queryFn: () =>
      adminService.listCategories({
        status: status === "all" ? undefined : status,
        per_page: ALL_CATEGORIES_PER_PAGE,
      }),
  });

  const groups = useMemo(() => {
    const categories = data?.data ?? [];
    const mainCategories = categories
      .filter((category) => !category.parent_id)
      .sort((a, b) => a.name.localeCompare(b.name));

    const byParentId = new Map<string, Category[]>();
    for (const category of categories) {
      if (!category.parent_id) continue;
      const siblings = byParentId.get(category.parent_id) ?? [];
      siblings.push(category);
      byParentId.set(category.parent_id, siblings);
    }

    const mainIds = new Set(mainCategories.map((category) => category.id));
    const orphanSubCategories = categories.filter(
      (category) => category.parent_id && !mainIds.has(category.parent_id)
    );

    return {
      mainCategories,
      byParentId,
      orphanSubCategories,
    };
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kategori</h1>
          <p className="text-sm text-muted-foreground">
            Kelola kategori utama dan tinjau sub kategori yang diajukan seller.
          </p>
        </div>
        <CategoryFormDialog />
      </div>

      <Select
        value={status}
        onValueChange={(value) => {
          setStatus(value);
        }}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          <SelectItem value="active">Aktif</SelectItem>
          <SelectItem value="pending">Menunggu Persetujuan</SelectItem>
        </SelectContent>
      </Select>

      {isLoading && (
        <DataTable
          columns={subCategoryColumns}
          data={[]}
          getRowKey={(row) => row.id}
          isLoading
        />
      )}

      {!isLoading && groups.mainCategories.length === 0 && groups.orphanSubCategories.length === 0 && (
        <DataTable
          columns={subCategoryColumns}
          data={[]}
          getRowKey={(row) => row.id}
          emptyMessage="Belum ada kategori."
        />
      )}

      {!isLoading &&
        groups.mainCategories.map((mainCategory) => {
          const subCategories = groups.byParentId.get(mainCategory.id) ?? [];
          return (
            <section key={mainCategory.id} className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold">{mainCategory.name}</h2>
                  <Badge variant={mainCategory.is_active ? "default" : "secondary"}>
                    {mainCategory.is_active ? "Aktif" : "Menunggu Persetujuan"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{mainCategory.slug}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CategoryFormDialog category={mainCategory} />
                  <CategoryActions category={mainCategory} />
                </div>
              </div>

              <DataTable
                columns={subCategoryColumns}
                data={subCategories}
                getRowKey={(row) => row.id}
                emptyMessage="Belum ada sub kategori."
              />
            </section>
          );
        })}

      {!isLoading && groups.orphanSubCategories.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-muted-foreground">Sub Kategori Lainnya</h2>
          <DataTable
            columns={subCategoryColumns}
            data={groups.orphanSubCategories}
            getRowKey={(row) => row.id}
            emptyMessage="Tidak ada."
          />
        </section>
      )}
    </div>
  );
}
