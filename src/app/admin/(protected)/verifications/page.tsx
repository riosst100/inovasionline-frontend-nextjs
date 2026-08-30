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
import { UserVerificationActions } from "@/features/admin/user-verification-actions";
import { UserVerificationDocumentsDialog } from "@/features/admin/user-verification-documents-dialog";
import { adminService } from "@/services/admin.service";
import type { UserVerification, UserVerificationStatus } from "@/types/auth";

const STATUS_VARIANT: Record<UserVerificationStatus, "default" | "outline" | "destructive" | "secondary"> = {
  pending: "outline",
  approved: "default",
  rejected: "destructive",
};

const STATUS_LABEL: Record<UserVerificationStatus, string> = {
  pending: "Menunggu",
  approved: "Terverifikasi",
  rejected: "Ditolak",
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(value));
}

const columns: DataTableColumn<UserVerification>[] = [
  {
    id: "full_name",
    header: "Nama",
    cell: (row) => <span className="font-medium">{row.full_name}</span>,
  },
  { id: "email", header: "Email", cell: (row) => row.user?.email ?? "-" },
  {
    id: "status",
    header: "Status",
    cell: (row) => <Badge variant={STATUS_VARIANT[row.status]}>{STATUS_LABEL[row.status]}</Badge>,
  },
  { id: "created_at", header: "Tanggal Pengajuan", cell: (row) => formatDate(row.created_at) },
  {
    id: "documents",
    header: "Dokumen",
    cell: (row) => <UserVerificationDocumentsDialog verification={row} />,
  },
  {
    id: "actions",
    header: "Aksi",
    cell: (row) => <UserVerificationActions verification={row} />,
  },
];

export default function AdminVerificationsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "verifications", { page, status }],
    queryFn: () =>
      adminService.listVerifications({ page, status: status === "all" ? undefined : status }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Verifikasi Pengguna</h1>
        <p className="text-sm text-muted-foreground">
          Tinjau dokumen verifikasi identitas pengguna dan kelola badge terverifikasi.
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
          <SelectItem value="approved">Terverifikasi</SelectItem>
          <SelectItem value="rejected">Ditolak</SelectItem>
        </SelectContent>
      </Select>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        getRowKey={(row) => row.id}
        isLoading={isLoading}
        emptyMessage="Belum ada pengajuan verifikasi."
      />

      {data && <DataTablePagination meta={data.meta} onPageChange={setPage} />}
    </div>
  );
}
