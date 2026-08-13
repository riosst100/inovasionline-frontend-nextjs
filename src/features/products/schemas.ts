import { z } from "zod";

export const productSchema = z.object({
  category_id: z.string().optional(),
  name: z.string().min(1, "Nama produk wajib diisi").max(255),
  short_description: z.string().max(255, "Maksimal 255 karakter").optional(),
  description: z.string().max(20000, "Deskripsi terlalu panjang").optional(),
  product_type: z.enum(["physical", "food", "service", "digital"], {
    error: "Jenis produk wajib dipilih",
  }),

  regular_price: z.number({ error: "Harga wajib diisi" }).min(0, "Harga tidak boleh negatif"),
  sale_price: z.number().min(0).optional(),
  sku: z.string().max(255).optional(),
  stock: z.number().int().min(0).optional(),
  track_inventory: z.boolean().optional(),
  requires_shipping: z.boolean().optional(),

  status: z.enum(["draft", "active", "inactive", "out_of_stock", "archived"]).optional(),

  images: z.array(z.instanceof(File)).max(8, "Maksimal 8 gambar").optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
