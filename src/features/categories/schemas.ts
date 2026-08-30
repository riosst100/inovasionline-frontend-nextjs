import { z } from "zod";

export const categorySchema = z.object({
  parent_id: z.string().min(1, "Pilih kategori utama"),
  name: z.string().min(1, "Nama kategori wajib diisi").max(255),
  description: z.string().max(2000).optional(),
  icon: z.string().max(255).optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
