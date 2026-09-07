"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateShippingRateTemplate, useUpdateShippingRateTemplate } from "@/features/admin/use-shipping-rate-templates";
import { ApiError } from "@/types/api";
import type { ShippingRateTemplate } from "@/types/shipping-rate";

const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(255),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ShippingRateTemplateFormDialog({ template }: { template?: ShippingRateTemplate }) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(template);
  const createTemplate = useCreateShippingRateTemplate();
  const updateTemplate = useUpdateShippingRateTemplate();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: template?.name ?? "", description: template?.description ?? "" },
  });

  useEffect(() => {
    if (open) {
      form.reset({ name: template?.name ?? "", description: template?.description ?? "" });
    }
  }, [open, template, form]);

  function handleError(error: unknown) {
    if (error instanceof ApiError) {
      if (error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          form.setError(field as keyof FormValues, { message: messages[0] });
        });
        return;
      }
      toast.error(error.message);
      return;
    }
    toast.error("Terjadi kesalahan. Silakan coba lagi.");
  }

  function onSubmit(values: FormValues) {
    if (isEdit && template) {
      updateTemplate.mutate(
        { id: template.id, payload: values },
        {
          onSuccess: () => {
            toast.success("Template berhasil diperbarui.");
            setOpen(false);
          },
          onError: handleError,
        }
      );
      return;
    }

    createTemplate.mutate(values, {
      onSuccess: () => {
        toast.success("Template berhasil dibuat.");
        setOpen(false);
      },
      onError: handleError,
    });
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
            Buat Template
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Template" : "Buat Template Tarif"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Template</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Tarif Kurir Jakarta Pusat" {...field} />
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
                  <FormLabel>Deskripsi (opsional)</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={createTemplate.isPending || updateTemplate.isPending}>
                {(createTemplate.isPending || updateTemplate.isPending) && <Loader2 className="h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
