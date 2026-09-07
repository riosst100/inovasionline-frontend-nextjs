export interface ShippingMethodRate {
  id: string;
  shipping_method_id: string;
  district_code: string | null;
  district_name: string | null;
  village_code: string | null;
  village_name: string | null;
  fee: number;
}

export interface ShippingRateTemplate {
  id: string;
  name: string;
  description: string | null;
  rows_count?: number;
}

export interface ShippingRateTemplateRow {
  id: string;
  shipping_rate_template_id: string;
  district_code: string | null;
  district_name: string | null;
  village_code: string | null;
  village_name: string | null;
  fee: number;
}

export interface ShippingRateTemplatePayload {
  name: string;
  description?: string;
}

export interface ShippingRateRowPayload {
  district_code?: string;
  village_code?: string;
  fee: number;
}

export interface RateImportResult {
  imported: number;
  skipped: { row: number; reason: string }[];
}
