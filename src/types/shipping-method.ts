export type ShippingMethodType = "store_pickup" | "seller_delivery" | "platform_delivery" | "courier";
export type ShippingRateType = "flat" | "table";

export interface ShippingMethodStoreSummary {
  id: string;
  name: string;
  slug: string;
}

export interface ShippingMethod {
  id: string;
  store_id: string;
  store?: ShippingMethodStoreSummary;
  type: ShippingMethodType;
  rate_type: ShippingRateType;
  name: string;
  description: string | null;
  base_fee: number;
  resolved_fee?: number;
  min_order_amount: number | null;
  estimated_delivery_time: string | null;
  pickup_address: string | null;
  pickup_instructions: string | null;
  pickup_hours: Record<string, unknown> | null;
  delivery_radius_km: number | null;
  free_shipping_min_amount: number | null;
  is_enabled: boolean;
  sort_order: number;
}

export interface ShippingMethodPayload {
  type: ShippingMethodType;
  rate_type?: ShippingRateType;
  name: string;
  description?: string;
  base_fee: number;
  min_order_amount?: number;
  estimated_delivery_time?: string;
  pickup_address?: string;
  pickup_instructions?: string;
  delivery_radius_km?: number;
  free_shipping_min_amount?: number;
  is_enabled?: boolean;
  sort_order?: number;
}
