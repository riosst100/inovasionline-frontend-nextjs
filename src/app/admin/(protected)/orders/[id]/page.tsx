"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { OrderDetailView } from "@/features/orders/order-detail-view";
import { adminService } from "@/services/admin.service";

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: order, isLoading } = useQuery({
    queryKey: ["admin", "orders", id],
    queryFn: () => adminService.getOrder(id),
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Memuat pesanan...</p>;
  }

  if (!order) {
    return <p className="text-sm text-muted-foreground">Pesanan tidak ditemukan.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Detail Pesanan</h1>
        <p className="text-sm text-muted-foreground">Tampilan hanya-baca untuk keperluan pemantauan.</p>
      </div>

      <OrderDetailView order={order} />
    </div>
  );
}
