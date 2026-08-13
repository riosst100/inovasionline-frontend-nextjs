"use client";

import { useQuery } from "@tanstack/react-query";
import { DataTable, type DataTableColumn } from "@/components/data-table/data-table";
import { FlashSaleSlotFormDialog } from "@/features/admin/flash-sale-slot-form-dialog";
import { FlashSaleSlotActions } from "@/features/admin/flash-sale-slot-actions";
import { adminService } from "@/services/admin.service";
import type { FlashSaleSlot } from "@/types/flash-sale-slot";

const columns: DataTableColumn<FlashSaleSlot>[] = [
  { id: "label", header: "Nama Slot", cell: (row) => <span className="font-medium">{row.label}</span> },
  { id: "time", header: "Jam", cell: (row) => `${row.start_time} - ${row.end_time}` },
  { id: "actions", header: "Status", cell: (row) => <FlashSaleSlotActions slot={row} /> },
];

export default function AdminFlashSaleSlotsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "flash-sale-slots"],
    queryFn: adminService.listFlashSaleSlots,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Flash Sale Slots</h1>
          <p className="text-sm text-muted-foreground">
            Kelola jam flash sale yang tersedia untuk seller pilih (berulang setiap hari).
          </p>
        </div>
        <FlashSaleSlotFormDialog />
      </div>

      <DataTable
        columns={columns}
        data={data ?? []}
        getRowKey={(row) => row.id}
        isLoading={isLoading}
        emptyMessage="Belum ada slot flash sale."
      />
    </div>
  );
}
