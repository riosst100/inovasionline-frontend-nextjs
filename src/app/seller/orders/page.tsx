"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useSellerOrders } from "@/features/seller/use-orders";
import type { Order, OrderStatus } from "@/types/order";

const STATUS_VARIANT: Record<OrderStatus, "default" | "outline" | "destructive" | "secondary"> = {
  pending: "outline",
  accepted: "secondary",
  processing: "secondary",
  ready: "secondary",
  completed: "default",
  cancelled: "destructive",
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Menunggu",
  accepted: "Diterima",
  processing: "Diproses",
  ready: "Siap",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

const columns: DataTableColumn<Order>[] = [
  { id: "order_number", header: "No. Pesanan", cell: (row) => <span className="font-medium">{row.order_number}</span> },
  { id: "user", header: "Pembeli", cell: (row) => row.user?.name ?? "-" },
  { id: "grand_total", header: "Total", cell: (row) => formatCurrency(row.grand_total) },
  {
    id: "status",
    header: "Status",
    cell: (row) => <Badge variant={STATUS_VARIANT[row.status]}>{STATUS_LABEL[row.status]}</Badge>,
  },
  {
    id: "payment_status",
    header: "Pembayaran",
    cell: (row) => (row.payment_status === "paid" ? <Badge>Lunas</Badge> : <Badge variant="outline">Belum Lunas</Badge>),
  },
  {
    id: "actions",
    header: "",
    cell: (row) => (
      <Button asChild size="sm" variant="outline">
        <Link href={`/seller/orders/${row.id}`}>Kelola</Link>
      </Button>
    ),
  },
];

export default function SellerOrdersPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSellerOrders({ page });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pesanan</h1>
        <p className="text-sm text-muted-foreground">Kelola pesanan yang masuk ke toko Anda.</p>
      </div>

      <DataTable columns={columns} data={data?.data ?? []} getRowKey={(row) => row.id} isLoading={isLoading} emptyMessage="Belum ada pesanan." />

      {data && <DataTablePagination meta={data.meta} onPageChange={setPage} />}
    </div>
  );
}
