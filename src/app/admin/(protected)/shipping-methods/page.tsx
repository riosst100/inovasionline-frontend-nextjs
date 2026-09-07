"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { ShippingMethodActions } from "@/features/admin/shipping-method-actions";
import { adminService } from "@/services/admin.service";
import type { ShippingMethod } from "@/types/shipping-method";

const TYPE_LABEL: Record<string, string> = {
  store_pickup: "Ambil di Toko",
  seller_delivery: "Kurir Toko",
  platform_delivery: "Kurir Aplikasi",
  courier: "Ekspedisi",
};

const columns: DataTableColumn<ShippingMethod>[] = [
  { id: "name", header: "Nama", cell: (row) => <span className="font-medium">{row.name}</span> },
  { id: "type", header: "Jenis", cell: (row) => TYPE_LABEL[row.type] ?? row.type },
  {
    id: "rate_type",
    header: "Tarif",
    cell: (row) => <Badge variant={row.rate_type === "table" ? "secondary" : "outline"}>{row.rate_type === "table" ? "Tabel" : "Flat"}</Badge>,
  },
  { id: "store", header: "Toko", cell: (row) => row.store?.name ?? "-" },
  { id: "actions", header: "Aktif", cell: (row) => <ShippingMethodActions method={row} /> },
];

export default function AdminShippingMethodsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "shipping-methods", page],
    queryFn: () => adminService.listShippingMethods({ page }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Metode Pengiriman</h1>
        <p className="text-sm text-muted-foreground">
          Pantau metode pengiriman milik seller. Seller mengelola isinya sendiri; admin hanya bisa menonaktifkan.
        </p>
      </div>

      <DataTable columns={columns} data={data?.data ?? []} getRowKey={(row) => row.id} isLoading={isLoading} emptyMessage="Belum ada metode pengiriman." />

      {data && <DataTablePagination meta={data.meta} onPageChange={setPage} />}
    </div>
  );
}
