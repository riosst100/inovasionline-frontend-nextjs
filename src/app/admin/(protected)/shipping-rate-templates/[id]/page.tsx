"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { RateRowManager } from "@/features/shipping-rates/rate-row-manager";
import {
  useCreateShippingRateTemplateRow,
  useDeleteShippingRateTemplateRow,
  useImportShippingRateTemplateRows,
  useShippingRateTemplateRows,
} from "@/features/admin/use-shipping-rate-templates";
import { shippingRateTemplateService } from "@/services/shipping-rate-template.service";

export default function AdminShippingRateTemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: template } = useQuery({
    queryKey: ["admin", "shipping-rate-templates", id, "meta"],
    queryFn: () => shippingRateTemplateService.list().then((templates) => templates.find((t) => t.id === id)),
  });

  const { data: rows, isLoading } = useShippingRateTemplateRows(id);
  const createRow = useCreateShippingRateTemplateRow(id);
  const deleteRow = useDeleteShippingRateTemplateRow(id);
  const importRows = useImportShippingRateTemplateRows(id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{template?.name ?? "Template Tarif"}</h1>
        <p className="text-sm text-muted-foreground">Kelola baris tarif untuk template ini.</p>
      </div>

      <RateRowManager
        rows={rows ?? []}
        isLoading={isLoading}
        exportUrl={shippingRateTemplateService.exportRowsUrl(id)}
        onCreateRow={(payload) => createRow.mutateAsync(payload)}
        onDeleteRow={(rowId) => deleteRow.mutateAsync(rowId)}
        onImport={(file) => importRows.mutateAsync(file)}
      />
    </div>
  );
}
