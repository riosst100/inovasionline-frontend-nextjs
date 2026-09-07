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
import { Textarea } from "@/components/ui/textarea";
import { useCreatePaymentMethod, useUpdatePaymentMethod } from "@/features/seller/use-payment-methods";
import { ApiError } from "@/types/api";
import type { PaymentMethod, PaymentMethodType } from "@/types/payment-method";

const TYPE_OPTIONS: { value: PaymentMethodType; label: string }[] = [
  { value: "cash", label: "Tunai" },
  { value: "bank_transfer", label: "Transfer Bank" },
  { value: "cash_on_delivery", label: "Bayar di Tempat (COD)" },
];

const schema = z.object({
  type: z.enum(["cash", "bank_transfer", "cash_on_delivery"]),
  name: z.string().min(1, "Nama wajib diisi").max(255),
  description: z.string().optional(),
  instructions: z.string().optional(),
  bank_name: z.string().optional(),
  account_number: z.string().optional(),
  account_holder_name: z.string().optional(),
  is_enabled: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

function defaultsFrom(method?: PaymentMethod): FormValues {
  return {
    type: method?.type ?? "cash",
    name: method?.name ?? "",
    description: method?.description ?? "",
    instructions: method?.instructions ?? "",
    bank_name: method?.bank_name ?? "",
    account_number: method?.account_number ?? "",
    account_holder_name: method?.account_holder_name ?? "",
    is_enabled: method?.is_enabled ?? true,
  };
}

export function PaymentMethodFormDialog({ method }: { method?: PaymentMethod }) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(method);
  const createMethod = useCreatePaymentMethod();
  const updateMethod = useUpdatePaymentMethod();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultsFrom(method),
  });

  useEffect(() => {
    if (open) form.reset(defaultsFrom(method));
  }, [open, method, form]);

  const type = form.watch("type");

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
            toast.success("Metode pembayaran berhasil diperbarui.");
            setOpen(false);
          },
          onError: handleError,
        }
      );
      return;
    }

    createMethod.mutate(values, {
      onSuccess: () => {
        toast.success("Metode pembayaran berhasil dibuat.");
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
            Tambah Metode Pembayaran
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Metode Pembayaran" : "Tambah Metode Pembayaran"}</DialogTitle>
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
                    <Input placeholder="Contoh: Transfer BCA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {type === "bank_transfer" && (
              <>
                <FormField
                  control={form.control}
                  name="bank_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Bank</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: BCA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="account_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Rekening</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="account_holder_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Atas Nama</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instruksi untuk Pembeli (opsional)</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
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
