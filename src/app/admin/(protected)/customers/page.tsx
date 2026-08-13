"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { adminService } from "@/services/admin.service";
import type { User, UserRole } from "@/types/auth";

const ROLE_LABEL: Record<UserRole, string> = {
  customer: "Customer",
  seller_owner: "Seller",
  seller_staff: "Staf Seller",
  platform_admin: "Admin",
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(value));
}

const columns: DataTableColumn<User>[] = [
  { id: "name", header: "Nama", cell: (row) => <span className="font-medium">{row.name}</span> },
  { id: "email", header: "Email", cell: (row) => row.email },
  { id: "phone", header: "Telepon", cell: (row) => row.phone ?? "-" },
  {
    id: "role",
    header: "Role",
    cell: (row) => <Badge variant="outline">{ROLE_LABEL[row.role]}</Badge>,
  },
  { id: "created_at", header: "Terdaftar", cell: (row) => formatDate(row.created_at) },
];

export default function AdminCustomersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "customers", { page, search }],
    queryFn: () => adminService.listCustomers({ page, search: search || undefined }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <p className="text-sm text-muted-foreground">Kelola pengguna yang terdaftar di platform.</p>
      </div>

      <div className="flex max-w-sm items-center gap-2 rounded-full border border-border bg-card px-3">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <Input
          placeholder="Cari nama atau email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        getRowKey={(row) => row.id}
        isLoading={isLoading}
        emptyMessage="Belum ada customer."
      />

      {data && <DataTablePagination meta={data.meta} onPageChange={setPage} />}
    </div>
  );
}
