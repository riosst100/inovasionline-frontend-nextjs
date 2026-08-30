"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { adminService } from "@/services/admin.service";
import { ApiError } from "@/types/api";
import type { Banner } from "@/types/banner";

const BANNERS_QUERY_KEY = ["admin", "banners"];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const bannerFormSchema = z.object({
  name: z.string().min(1, "Nama banner wajib diisi").max(255),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_IMAGE_SIZE, "Ukuran gambar maksimal 2MB")
    .optional(),
  link_url: z.union([z.literal(""), z.string().url("Masukkan URL yang valid")]),
  is_active: z.boolean(),
});

type BannerFormValues = z.infer<typeof bannerFormSchema>;

export function BannerFormDialog({ banner }: { banner?: Banner }) {
  const isEdit = Boolean(banner);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      name: banner?.name ?? "",
      image: undefined,
      link_url: banner?.link_url ?? "",
      is_active: banner?.is_active ?? true,
    },
  });

  const selectedImage = form.watch("image");
  const preview = selectedImage ? URL.createObjectURL(selectedImage) : banner?.image_url;

  useEffect(() => {
    if (open) {
      form.reset({
        name: banner?.name ?? "",
        image: undefined,
        link_url: banner?.link_url ?? "",
        is_active: banner?.is_active ?? true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const saveBanner = useMutation({
    mutationFn: (values: BannerFormValues) => {
      if (!isEdit && !values.image) {
        throw new Error("Gambar banner wajib diunggah");
      }
      return isEdit && banner
        ? adminService.updateBanner(banner.id, values)
        : adminService.createBanner({ ...values, image: values.image as File });
    },
    onSuccess: () => {
      toast.success(isEdit ? "Banner berhasil diperbarui." : "Banner berhasil dibuat.");
      queryClient.invalidateQueries({ queryKey: BANNERS_QUERY_KEY });
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        if (error.errors) {
          Object.entries(error.errors).forEach(([field, messages]) => {
            form.setError(field as keyof BannerFormValues, { message: messages[0] });
          });
          return;
        }
        toast.error(error.message);
        return;
      }
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan. Silakan coba lagi.");
    },
  });

  function onSubmit(values: BannerFormValues) {
    saveBanner.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button type="button" size="icon-sm" variant="ghost">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button type="button">
            <Plus />
            Tambah Banner
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Banner" : "Tambah Banner"}</DialogTitle>
          <DialogDescription>Banner ini akan ditampilkan pada halaman utama marketplace.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Banner</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Promo Akhir Tahun" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ref, name, onBlur } }) => (
                <FormItem>
                  <FormLabel>Gambar Banner</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      name={name}
                      ref={ref}
                      onBlur={onBlur}
                      onChange={(event) => onChange(event.target.files?.[0])}
                    />
                  </FormControl>
                  {preview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview}
                      alt="Pratinjau banner"
                      className="h-32 w-full rounded-md border border-border object-cover"
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link Tujuan (opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://contoh.com/promo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-md border border-border p-3">
                  <FormLabel className="!mt-0">Aktif</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={saveBanner.isPending}>
                {saveBanner.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
