"use client";

import { DataTable, type DataTableColumn } from "@/components/data-table/data-table";
import { ShippingRateTemplateActions } from "@/features/admin/shipping-rate-template-actions";
import { ShippingRateTemplateFormDialog } from "@/features/admin/shipping-rate-template-form-dialog";
import { useShippingRateTemplates } from "@/features/admin/use-shipping-rate-templates";
import type { ShippingRateTemplate } from "@/types/shipping-rate";

const columns: DataTableColumn<ShippingRateTemplate>[] = [
  { id: "name", header: "Nama", cell: (row) => <span className="font-medium">{row.name}</span> },
  { id: "description", header: "Deskripsi", cell: (row) => row.description ?? "-" },
  { id: "rows_count", header: "Jumlah Baris", cell: (row) => row.rows_count ?? 0 },
  { id: "actions", header: "", cell: (row) => <ShippingRateTemplateActions template={row} /> },
];

export default function AdminShippingRateTemplatesPage() {
  const { data, isLoading } = useShippingRateTemplates();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Template Tarif Pengiriman</h1>
          <p className="text-sm text-muted-foreground">
            Buat template tarif pengiriman lokal yang bisa disalin dan disesuaikan oleh seller. Opsional.
          </p>
        </div>
        <ShippingRateTemplateFormDialog />
      </div>

      <DataTable columns={columns} data={data ?? []} getRowKey={(row) => row.id} isLoading={isLoading} emptyMessage="Belum ada template tarif." />
    </div>
  );
}
