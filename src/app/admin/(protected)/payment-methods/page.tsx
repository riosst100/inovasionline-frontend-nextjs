"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable, type DataTableColumn } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { PaymentMethodActions } from "@/features/admin/payment-method-actions";
import { adminService } from "@/services/admin.service";
import type { PaymentMethod } from "@/types/payment-method";

const TYPE_LABEL: Record<string, string> = {
  cash: "Tunai",
  bank_transfer: "Transfer Bank",
  cash_on_delivery: "Bayar di Tempat",
};

const columns: DataTableColumn<PaymentMethod>[] = [
  { id: "name", header: "Nama", cell: (row) => <span className="font-medium">{row.name}</span> },
  { id: "type", header: "Jenis", cell: (row) => TYPE_LABEL[row.type] ?? row.type },
  { id: "store", header: "Toko", cell: (row) => row.store?.name ?? "-" },
  { id: "actions", header: "Aktif", cell: (row) => <PaymentMethodActions method={row} /> },
];

export default function AdminPaymentMethodsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "payment-methods", page],
    queryFn: () => adminService.listPaymentMethods({ page }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Metode Pembayaran</h1>
        <p className="text-sm text-muted-foreground">
          Pantau metode pembayaran milik seller. Seller mengelola isinya sendiri; admin hanya bisa menonaktifkan.
        </p>
      </div>

      <DataTable columns={columns} data={data?.data ?? []} getRowKey={(row) => row.id} isLoading={isLoading} emptyMessage="Belum ada metode pembayaran." />

      {data && <DataTablePagination meta={data.meta} onPageChange={setPage} />}
    </div>
  );
}
