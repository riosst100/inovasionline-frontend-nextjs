"use client";

import { useState } from "react";
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
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { SellerApplicationActions } from "@/features/admin/seller-application-actions";
import { adminService } from "@/services/admin.service";
import type { SellerApplication, SellerApplicationStatus } from "@/types/auth";

const STATUS_VARIANT: Record<SellerApplicationStatus, "default" | "outline" | "destructive" | "secondary"> = {
  pending: "outline",
  approved: "default",
  rejected: "destructive",
  suspended: "secondary",
};

const STATUS_LABEL: Record<SellerApplicationStatus, string> = {
  pending: "Menunggu",
  approved: "Disetujui",
  rejected: "Ditolak",
  suspended: "Ditangguhkan",
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(value));
}

const columns: DataTableColumn<SellerApplication>[] = [
  {
    id: "store_name",
    header: "Nama Toko",
    cell: (row) => <span className="font-medium">{row.store_name}</span>,
  },
  { id: "full_name", header: "Pemilik", cell: (row) => row.full_name },
  { id: "email", header: "Email", cell: (row) => row.email },
  {
    id: "status",
    header: "Status",
    cell: (row) => <Badge variant={STATUS_VARIANT[row.status]}>{STATUS_LABEL[row.status]}</Badge>,
  },
  { id: "created_at", header: "Tanggal Pengajuan", cell: (row) => formatDate(row.created_at) },
  {
    id: "actions",
    header: "Aksi",
    cell: (row) => <SellerApplicationActions application={row} />,
  },
];

export default function AdminSellersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "seller-applications", { page, status }],
    queryFn: () =>
      adminService.listSellerApplications({ page, status: status === "all" ? undefined : status }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Seller Applications</h1>
        <p className="text-sm text-muted-foreground">
          Tinjau dan kelola pengajuan calon seller di platform.
        </p>
      </div>

      <Select
        value={status}
        onValueChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          <SelectItem value="pending">Menunggu</SelectItem>
          <SelectItem value="approved">Disetujui</SelectItem>
          <SelectItem value="rejected">Ditolak</SelectItem>
          <SelectItem value="suspended">Ditangguhkan</SelectItem>
        </SelectContent>
      </Select>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        getRowKey={(row) => row.id}
        isLoading={isLoading}
        emptyMessage="Belum ada pengajuan seller."
      />

      {data && <DataTablePagination meta={data.meta} onPageChange={setPage} />}
    </div>
  );
}
