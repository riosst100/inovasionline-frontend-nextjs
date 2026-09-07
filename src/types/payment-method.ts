export type PaymentMethodType = "cash" | "bank_transfer" | "cash_on_delivery";

export interface PaymentMethodStoreSummary {
  id: string;
  name: string;
  slug: string;
}

export interface PaymentMethod {
  id: string;
  store_id: string;
  store?: PaymentMethodStoreSummary;
  type: PaymentMethodType;
  name: string;
  description: string | null;
  instructions: string | null;
  bank_name: string | null;
  account_number: string | null;
  account_holder_name: string | null;
  is_enabled: boolean;
  sort_order: number;
}

export interface PaymentMethodPayload {
  type: PaymentMethodType;
  name: string;
  description?: string;
  instructions?: string;
  bank_name?: string;
  account_number?: string;
  account_holder_name?: string;
  is_enabled?: boolean;
  sort_order?: number;
}
