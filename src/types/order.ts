import type { PaymentMethod } from "./payment-method";
import type { ShippingMethod } from "./shipping-method";

export type OrderStatus = "pending" | "accepted" | "processing" | "ready" | "completed" | "cancelled";
export type PaymentStatus = "unpaid" | "paid" | "failed" | "refunded";

export interface OrderStoreSummary {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
}

export interface OrderUserSummary {
  id: string;
  name: string;
  email?: string;
}

export interface OrderItem {
  id: string;
  product_id: string | null;
  product_variant_id: string | null;
  product_name: string;
  product_sku: string | null;
  variant_name: string | null;
  product_image_url: string | null;
  unit_price: number;
  quantity: number;
  discount_amount: number;
  line_total: number;
  notes: string | null;
}

export interface OrderStatusHistoryEntry {
  status: string;
  at: string;
  by: string;
}

export interface Order {
  id: string;
  order_number: string;
  store?: OrderStoreSummary;
  user?: OrderUserSummary;
  payment_method?: PaymentMethod | null;
  shipping_method?: ShippingMethod | null;
  items: OrderItem[];
  subtotal: number;
  discount_total: number;
  shipping_fee: number;
  tax_total: number;
  grand_total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  delivery_method: string | null;
  delivery_address: Record<string, string | null> | null;
  customer_notes: string | null;
  seller_notes: string | null;
  status_history: OrderStatusHistoryEntry[];
  created_at: string;
}
