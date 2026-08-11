import { z } from "zod";

export const sellerApplicationSchema = z.object({
  full_name: z.string().min(1, "Nama lengkap wajib diisi").max(255),
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  phone: z
    .string()
    .min(1, "Nomor telepon wajib diisi")
    .regex(/^[0-9+()\-\s]{8,20}$/, "Format nomor telepon tidak valid"),
  store_name: z.string().min(1, "Nama toko wajib diisi").max(255),
  business_type: z.enum(["individual", "company"], {
    error: "Jenis usaha wajib dipilih",
  }),
  business_description: z.string().max(2000, "Deskripsi maksimal 2000 karakter").optional(),
  address: z.string().min(1, "Alamat wajib diisi").max(255),
  province: z.string().min(1, "Provinsi wajib diisi").max(255),
  city: z.string().min(1, "Kota/Kabupaten wajib diisi").max(255),
  district: z.string().max(255).optional(),
  postal_code: z.string().max(10).optional(),
});

export type SellerApplicationFormValues = z.infer<typeof sellerApplicationSchema>;
