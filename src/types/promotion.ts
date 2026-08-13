import type { Product } from "@/types/product";
import type { FlashSaleSlot } from "@/types/flash-sale-slot";

export type PromotionType = "percentage_discount" | "fixed_discount" | "free_shipping" | "buy_one_get_one";

export interface Promotion {
  id: string;
  store_id: string;
  flash_sale_slot: FlashSaleSlot | null;
  name: string;
  code: string | null;
  type: PromotionType;
  discount_value: string | null;
  minimum_purchase: string | null;
  maximum_discount: string | null;
  usage_limit: number | null;
  usage_count: number;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  is_currently_active: boolean;
  products: Product[];
  created_at: string;
}

export interface PromotionPayload {
  name: string;
  code?: string;
  type: PromotionType;
  discount_value?: number;
  minimum_purchase?: number;
  maximum_discount?: number;
  usage_limit?: number;
  flash_sale_slot_id: string;
  date: string;
  is_active?: boolean;
  product_ids: string[];
}
