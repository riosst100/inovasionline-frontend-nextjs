import { z } from "zod";

const MAX_FILE_SIZE = 4 * 1024 * 1024;

const fileSchema = z
  .instanceof(File, { message: "File wajib diunggah" })
  .refine((file) => file.size <= MAX_FILE_SIZE, "Ukuran file maksimal 4MB")
  .refine(
    (file) => ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
    "Format file harus JPG atau PNG"
  );

export const userVerificationSchema = z.object({
  full_name: z.string().min(1, "Nama lengkap wajib diisi").max(255),
  id_number: z.string().max(50).optional(),
  selfie: fileSchema,
  document: fileSchema,
});

export type UserVerificationFormValues = z.infer<typeof userVerificationSchema>;
