export interface FlashSaleSlot {
  id: string;
  label: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
  sort_order: number;
}

export interface FlashSaleSlotPayload {
  label: string;
  start_time: string;
  end_time: string;
  is_active?: boolean;
  sort_order?: number;
}
