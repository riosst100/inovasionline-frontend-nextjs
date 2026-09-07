"use client";

import { use } from "react";
import { OrderDetailView } from "@/features/orders/order-detail-view";
import { OrderStatusActions } from "@/features/seller/order-status-actions";
import { useSellerOrder } from "@/features/seller/use-orders";

export default function SellerOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: order, isLoading } = useSellerOrder(id);

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
        <p className="text-sm text-muted-foreground">Kelola status dan pembayaran pesanan ini.</p>
      </div>

      <OrderDetailView order={order}>
        <OrderStatusActions order={order} />
      </OrderDetailView>
    </div>
  );
}
