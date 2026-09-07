"use client";

import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/data-table/data-table";
import { PaymentMethodActions } from "@/features/seller/payment-method-actions";
import { PaymentMethodFormDialog } from "@/features/seller/payment-method-form-dialog";
import { usePaymentMethods } from "@/features/seller/use-payment-methods";
import type { PaymentMethod } from "@/types/payment-method";

const TYPE_LABEL: Record<string, string> = {
  cash: "Tunai",
  bank_transfer: "Transfer Bank",
  cash_on_delivery: "Bayar di Tempat",
};

const columns: DataTableColumn<PaymentMethod>[] = [
  { id: "name", header: "Nama", cell: (row) => <span className="font-medium">{row.name}</span> },
  { id: "type", header: "Jenis", cell: (row) => TYPE_LABEL[row.type] ?? row.type },
  {
    id: "status",
    header: "Status",
    cell: (row) => <Badge variant={row.is_enabled ? "default" : "outline"}>{row.is_enabled ? "Aktif" : "Nonaktif"}</Badge>,
  },
  { id: "actions", header: "", cell: (row) => <PaymentMethodActions method={row} /> },
];

export default function SellerPaymentMethodsPage() {
  const { data, isLoading } = usePaymentMethods();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Metode Pembayaran</h1>
          <p className="text-sm text-muted-foreground">Kelola metode pembayaran yang ditawarkan toko Anda ke pembeli.</p>
        </div>
        <PaymentMethodFormDialog />
      </div>

      <DataTable columns={columns} data={data ?? []} getRowKey={(row) => row.id} isLoading={isLoading} emptyMessage="Belum ada metode pembayaran." />
    </div>
  );
}
