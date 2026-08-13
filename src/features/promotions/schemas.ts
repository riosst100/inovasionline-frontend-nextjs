import { z } from "zod";

export const promotionSchema = z
  .object({
    name: z.string().min(1, "Nama promosi wajib diisi").max(255),
    code: z.string().max(50).optional(),
    type: z.enum(["percentage_discount", "fixed_discount"], {
      error: "Jenis promosi wajib dipilih",
    }),
    discount_value: z.number().min(0, "Nilai diskon tidak boleh negatif").optional(),
    flash_sale_slot_id: z.string().min(1, "Pilih slot waktu flash sale"),
    date: z.string().min(1, "Tanggal wajib diisi"),
    is_active: z.boolean().optional(),
    product_ids: z.array(z.string()).min(1, "Pilih minimal 1 produk"),
  })
  .refine((data) => data.discount_value !== undefined, {
    message: "Nilai diskon wajib diisi",
    path: ["discount_value"],
  });

export type PromotionFormValues = z.infer<typeof promotionSchema>;
