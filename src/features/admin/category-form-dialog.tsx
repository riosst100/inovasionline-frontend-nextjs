"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { adminService } from "@/services/admin.service";
import { categoryService } from "@/services/category.service";
import { ApiError } from "@/types/api";
import type { Category } from "@/types/product";

const ADMIN_CATEGORIES_QUERY_KEY = ["admin", "categories"];
const NO_PARENT = "__none__";

const categoryFormSchema = z.object({
  parent_id: z.string(),
  name: z.string().min(1, "Nama kategori wajib diisi").max(255),
  description: z.string().max(2000).optional(),
  icon: z.string().max(255).optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export function CategoryFormDialog({ category }: { category?: Category }) {
  const isEdit = Boolean(category);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: rootCategories } = useQuery({
    queryKey: ["categories", "root"],
    queryFn: categoryService.rootList,
    enabled: open,
  });

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      parent_id: category?.parent_id ?? NO_PARENT,
      name: category?.name ?? "",
      description: category?.description ?? "",
      icon: category?.icon ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        parent_id: category?.parent_id ?? NO_PARENT,
        name: category?.name ?? "",
        description: category?.description ?? "",
        icon: category?.icon ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const saveCategory = useMutation({
    mutationFn: (values: CategoryFormValues) => {
      const payload = { ...values, parent_id: values.parent_id === NO_PARENT ? null : values.parent_id };
      return isEdit && category
        ? adminService.updateCategory(category.id, payload)
        : adminService.createCategory(payload);
    },
    onSuccess: () => {
      toast.success(isEdit ? "Kategori berhasil diperbarui." : "Kategori berhasil dibuat.");
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      form.reset();
      setOpen(false);
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

  function onSubmit(values: CategoryFormValues) {
    saveCategory.mutate(values);
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
            Tambah Kategori
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
          <DialogDescription>
            Kosongkan kategori utama untuk menjadikannya kategori utama, atau pilih salah satu untuk menjadikannya
            sub kategori. Perubahan dari admin langsung aktif tanpa persetujuan.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="parent_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori Utama</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Kosongkan untuk kategori utama" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={NO_PARENT}>Tidak ada (kategori utama)</SelectItem>
                      {rootCategories
                        ?.filter((root) => root.id !== category?.id)
                        .map((root) => (
                          <SelectItem key={root.id} value={root.id}>
                            {root.name}
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
                  <FormLabel>Nama Kategori</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Elektronik" {...field} />
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
                    <Textarea placeholder="Deskripsi singkat kategori (opsional)" rows={3} {...field} />
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

            <DialogFooter>
              <Button type="submit" disabled={saveCategory.isPending}>
                {saveCategory.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
