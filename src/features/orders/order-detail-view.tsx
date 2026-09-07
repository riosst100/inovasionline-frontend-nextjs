import type { Order, OrderStatus } from "@/types/order";
import { Badge } from "@/components/ui/badge";

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

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function OrderDetailView({ order, children }: { order: Order; children?: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5">
        <div>
          <p className="text-lg font-semibold">{order.order_number}</p>
          <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
        </div>
        <div className="flex gap-2">
          <Badge>{STATUS_LABEL[order.status]}</Badge>
          <Badge variant={order.payment_status === "paid" ? "default" : "outline"}>
            {order.payment_status === "paid" ? "Lunas" : "Belum Lunas"}
          </Badge>
        </div>
      </div>

      {children}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-3 text-sm font-semibold">Toko</h2>
          <p className="text-sm">{order.store?.name ?? "-"}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-3 text-sm font-semibold">Pembeli</h2>
          <p className="text-sm">{order.user?.name ?? "-"}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold">Produk</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">{item.product_name}{item.variant_name ? ` (${item.variant_name})` : ""}</p>
                <p className="text-muted-foreground">
                  {item.quantity} x {formatCurrency(item.unit_price)}
                </p>
              </div>
              <p className="font-medium">{formatCurrency(item.line_total)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold">Ringkasan</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatCurrency(order.subtotal)}</dd></div>
          {order.discount_total > 0 && (
            <div className="flex justify-between"><dt className="text-muted-foreground">Diskon</dt><dd>-{formatCurrency(order.discount_total)}</dd></div>
          )}
          <div className="flex justify-between"><dt className="text-muted-foreground">Ongkos Kirim</dt><dd>{formatCurrency(order.shipping_fee)}</dd></div>
          {order.tax_total > 0 && (
            <div className="flex justify-between"><dt className="text-muted-foreground">Pajak</dt><dd>{formatCurrency(order.tax_total)}</dd></div>
          )}
          <div className="flex justify-between border-t border-border pt-2 font-semibold"><dt>Total</dt><dd>{formatCurrency(order.grand_total)}</dd></div>
        </dl>
      </div>

      {order.payment_method && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-3 text-sm font-semibold">Metode Pembayaran</h2>
          <p className="text-sm font-medium">{order.payment_method.name}</p>
          {order.payment_method.bank_name && (
            <p className="text-sm text-muted-foreground">
              {order.payment_method.bank_name} - {order.payment_method.account_number} a.n. {order.payment_method.account_holder_name}
            </p>
          )}
        </div>
      )}

      {order.delivery_address && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-3 text-sm font-semibold">Alamat Pengiriman</h2>
          <p className="text-sm font-medium">{order.delivery_address.recipient_name}</p>
          <p className="text-sm text-muted-foreground">{order.delivery_address.recipient_phone}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {[
              order.delivery_address.address_detail,
              order.delivery_address.village_name,
              order.delivery_address.district_name,
              order.delivery_address.city_name,
              order.delivery_address.province_name,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      )}

      {order.status_history.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-3 text-sm font-semibold">Riwayat Status</h2>
          <div className="space-y-2">
            {[...order.status_history].reverse().map((entry, index) => (
              <p key={index} className="text-sm text-muted-foreground">
                {STATUS_LABEL[entry.status as OrderStatus] ?? entry.status} &middot; {formatDate(entry.at)} &middot; {entry.by}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
