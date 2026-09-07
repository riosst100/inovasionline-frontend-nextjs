"use client";

import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/data-table/data-table";
import { ShippingMethodActions } from "@/features/seller/shipping-method-actions";
import { ShippingMethodFormDialog } from "@/features/seller/shipping-method-form-dialog";
import { useShippingMethods } from "@/features/seller/use-shipping-methods";
import type { ShippingMethod } from "@/types/shipping-method";

const TYPE_LABEL: Record<string, string> = {
  store_pickup: "Ambil di Toko",
  seller_delivery: "Kurir Toko",
  platform_delivery: "Kurir Aplikasi",
  courier: "Ekspedisi",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

const columns: DataTableColumn<ShippingMethod>[] = [
  { id: "name", header: "Nama", cell: (row) => <span className="font-medium">{row.name}</span> },
  { id: "type", header: "Jenis", cell: (row) => TYPE_LABEL[row.type] ?? row.type },
  {
    id: "rate",
    header: "Tarif",
    cell: (row) => (row.rate_type === "table" ? <Badge variant="secondary">Tabel per Wilayah</Badge> : formatCurrency(row.base_fee)),
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => <Badge variant={row.is_enabled ? "default" : "outline"}>{row.is_enabled ? "Aktif" : "Nonaktif"}</Badge>,
  },
  { id: "actions", header: "", cell: (row) => <ShippingMethodActions method={row} /> },
];

export default function SellerShippingMethodsPage() {
  const { data, isLoading } = useShippingMethods();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Metode Pengiriman</h1>
          <p className="text-sm text-muted-foreground">Kelola metode pengiriman yang ditawarkan toko Anda ke pembeli.</p>
        </div>
        <ShippingMethodFormDialog />
      </div>

      <DataTable columns={columns} data={data ?? []} getRowKey={(row) => row.id} isLoading={isLoading} emptyMessage="Belum ada metode pengiriman." />
    </div>
  );
}
