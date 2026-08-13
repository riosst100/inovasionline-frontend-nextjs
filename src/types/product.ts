export type ProductType = "physical" | "food" | "service" | "digital";

export type ProductStatus = "draft" | "active" | "inactive" | "out_of_stock" | "archived";

export interface ProductImage {
  id: string;
  url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
}

export interface Product {
  id: string;
  store_id: string;
  category_id: string | null;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  product_type: ProductType;

  regular_price: string;
  sale_price: string | null;
  cost_price: string | null;
  is_taxable: boolean;

  sku: string | null;
  stock: number;
  min_stock: number;
  track_inventory: boolean;

  weight: string | null;
  length: string | null;
  width: string | null;
  height: string | null;
  requires_shipping: boolean;

  status: ProductStatus;
  available_start_at: string | null;
  available_end_at: string | null;

  meta_title: string | null;
  meta_description: string | null;

  images: ProductImage[];

  created_at: string;
}

export interface ProductPayload {
  category_id?: string | null;
  name: string;
  short_description?: string;
  description?: string;
  product_type: ProductType;

  regular_price: number;
  sale_price?: number | null;
  cost_price?: number | null;
  is_taxable?: boolean;

  sku?: string;
  stock?: number;
  min_stock?: number;
  track_inventory?: boolean;

  weight?: number | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  requires_shipping?: boolean;

  status?: ProductStatus;

  meta_title?: string;
  meta_description?: string;

  images?: File[];
}

export interface Category {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  icon: string | null;
}

export interface PublicProduct {
  id: string;
  name: string;
  slug: string;
  regular_price: string;
  sale_price: string | null;
  discount_percent: number | null;
  stock: number;
  sold_count: number;
  image_url: string | null;
  store_name: string | null;
  promotion_ends_at: string | null;
}

export interface PublicProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface PublicProductStore {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  city: string | null;
  delivery_available: boolean;
}

export interface PublicProductDetail {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  product_type: ProductType;

  regular_price: string;
  sale_price: string | null;
  discount_percent: number | null;
  promotion_ends_at: string | null;

  stock: number;
  sold_count: number;

  weight: string | null;
  requires_shipping: boolean;

  images: ProductImage[];
  category: PublicProductCategory | null;
  store: PublicProductStore | null;

  created_at: string;
}

export type StoreSort = "nearest" | "popular" | "newest";

export interface PublicStore {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  cover_url: string | null;
  city: string | null;
  province: string | null;
  city_code: string | null;
  is_featured: boolean;
  delivery_available: boolean;
  product_count: number;
  sold_count: number;
}

export type FlashSaleSlotStatus = "upcoming" | "active" | "ended";

export interface FlashSaleScheduleSlot {
  id: string;
  label: string;
  start_time: string;
  end_time: string;
  starts_at: string;
  ends_at: string;
  status: FlashSaleSlotStatus;
  products: PublicProduct[];
}

export interface FlashSaleSchedule {
  date: string | null;
  slots: FlashSaleScheduleSlot[];
  available_dates: string[];
}
