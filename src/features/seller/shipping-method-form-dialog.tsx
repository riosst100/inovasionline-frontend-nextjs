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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCreateShippingMethod, useUpdateShippingMethod } from "@/features/seller/use-shipping-methods";
import { ApiError } from "@/types/api";
import type { ShippingMethod, ShippingMethodType } from "@/types/shipping-method";

const TYPE_OPTIONS: { value: ShippingMethodType; label: string }[] = [
  { value: "store_pickup", label: "Ambil di Toko" },
  { value: "seller_delivery", label: "Kurir Toko" },
  { value: "platform_delivery", label: "Kurir Aplikasi" },
  { value: "courier", label: "Ekspedisi (JNE, J&T, dll)" },
];

const schema = z.object({
  type: z.enum(["store_pickup", "seller_delivery", "platform_delivery", "courier"]),
  rate_type: z.enum(["flat", "table"]),
  name: z.string().min(1, "Nama wajib diisi").max(255),
  description: z.string().optional(),
  base_fee: z.number().min(0),
  free_shipping_min_amount: z.number().min(0).optional(),
  estimated_delivery_time: z.string().optional(),
  is_enabled: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

function defaultsFrom(method?: ShippingMethod): FormValues {
  return {
    type: method?.type ?? "seller_delivery",
    rate_type: method?.rate_type ?? "flat",
    name: method?.name ?? "",
    description: method?.description ?? "",
    base_fee: method?.base_fee ?? 0,
    free_shipping_min_amount: method?.free_shipping_min_amount ?? undefined,
    estimated_delivery_time: method?.estimated_delivery_time ?? "",
    is_enabled: method?.is_enabled ?? true,
  };
}

export function ShippingMethodFormDialog({ method }: { method?: ShippingMethod }) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(method);
  const createMethod = useCreateShippingMethod();
  const updateMethod = useUpdateShippingMethod();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultsFrom(method),
  });

  useEffect(() => {
    if (open) form.reset(defaultsFrom(method));
  }, [open, method, form]);

  const rateType = form.watch("rate_type");

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
    if (isEdit && method) {
      updateMethod.mutate(
        { id: method.id, payload: values },
        {
          onSuccess: () => {
            toast.success("Metode pengiriman berhasil diperbarui.");
            setOpen(false);
          },
          onError: handleError,
        }
      );
      return;
    }

    createMethod.mutate(values, {
      onSuccess: () => {
        toast.success("Metode pengiriman berhasil dibuat.");
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
            Tambah Metode Pengiriman
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Metode Pengiriman" : "Tambah Metode Pengiriman"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Kurir Toko" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rate_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cara Menetapkan Tarif</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="flat">Tarif Flat (satu harga untuk semua tujuan)</SelectItem>
                      <SelectItem value="table">Tabel Tarif per Wilayah (untuk pengiriman lokal)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {rateType === "flat" && (
              <FormField
                control={form.control}
                name="base_fee"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Tarif (Rp)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        value={value ?? ""}
                        onChange={(e) => onChange(e.target.value === "" ? 0 : e.target.valueAsNumber)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {rateType === "table" && (
              <p className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
                Tarif per wilayah dikelola terpisah setelah metode ini dibuat, di halaman &ldquo;Kelola Tarif&rdquo;.
              </p>
            )}

            <FormField
              control={form.control}
              name="free_shipping_min_amount"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Gratis Ongkir Minimal Belanja (opsional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      value={value ?? ""}
                      onChange={(e) => onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimated_delivery_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimasi Waktu Pengiriman (opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: 1-2 hari" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_enabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
                  <FormLabel className="mb-0">Aktif</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={createMethod.isPending || updateMethod.isPending}>
                {(createMethod.isPending || updateMethod.isPending) && <Loader2 className="h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
