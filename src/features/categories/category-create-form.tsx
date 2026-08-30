"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCategory, useRootCategories } from "@/features/categories/use-categories";
import { categorySchema, type CategoryFormValues } from "@/features/categories/schemas";
import { ApiError } from "@/types/api";

export function CategoryCreateForm() {
  const router = useRouter();
  const createCategory = useCreateCategory();
  const { data: rootCategories, isLoading: rootCategoriesLoading } = useRootCategories();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      parent_id: "",
      name: "",
      description: "",
      icon: "",
    },
  });

  function onSubmit(values: CategoryFormValues) {
    createCategory.mutate(values, {
      onSuccess: () => {
        toast.success("Sub kategori berhasil diajukan dan menunggu persetujuan admin.");
        router.push("/seller/categories");
        router.refresh();
      },
      onError: (error) => {
        if (error instanceof ApiError) {
          if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
              form.setError(field as keyof CategoryFormValues, { message: messages[0] });
            });
            return;
          }
          toast.error(error.message);
          return;
        }
        toast.error("Terjadi kesalahan. Silakan coba lagi.");
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-base font-semibold">Informasi Sub Kategori</h2>
          <FormField
            control={form.control}
            name="parent_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori Utama</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={rootCategoriesLoading ? "Memuat kategori..." : "Pilih kategori utama"}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {rootCategories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Sub Kategori</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: Peralatan Dapur" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi</FormLabel>
                <FormControl>
                  <Textarea placeholder="Deskripsi singkat kategori (opsional)" rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <FormControl>
                  <Input placeholder="Nama icon (opsional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="text-sm text-muted-foreground">
            Sub kategori baru akan ditinjau oleh admin sebelum aktif dan dapat digunakan pada produk.
          </p>
        </section>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit" disabled={createCategory.isPending}>
            {createCategory.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Ajukan Sub Kategori
          </Button>
        </div>
      </form>
    </Form>
  );
}
