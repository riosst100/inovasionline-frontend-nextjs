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
import { useCreatePromotion } from "@/features/promotions/use-promotions";
import { useFlashSaleSlots } from "@/features/promotions/use-flash-sale-slots";
import { promotionSchema, type PromotionFormValues } from "@/features/promotions/schemas";
import { PromotionProductSelect } from "@/features/promotions/promotion-product-select";
import { ApiError } from "@/types/api";
import type { FlashSaleSlot } from "@/types/flash-sale-slot";

const PROMOTION_TYPES: { value: PromotionFormValues["type"]; label: string }[] = [
  { value: "percentage_discount", label: "Diskon Persentase (%)" },
  { value: "fixed_discount", label: "Diskon Nominal (Rp)" },
];

function todayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getAvailableSlots(slots: FlashSaleSlot[] | undefined, date: string): FlashSaleSlot[] {
  if (!slots) return [];
  if (date !== todayDateString()) return slots;

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return slots.filter((slot) => {
    const [hours, minutes] = slot.start_time.split(":").map(Number);
    return hours * 60 + minutes > nowMinutes;
  });
}

export function PromotionCreateForm() {
  const router = useRouter();
  const createPromotion = useCreatePromotion();
  const { data: slots, isLoading: slotsLoading } = useFlashSaleSlots();

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      name: "",
      code: "",
      type: "percentage_discount",
      date: "",
      flash_sale_slot_id: "",
      is_active: true,
      product_ids: [],
    },
  });

  const type = form.watch("type");
  const date = form.watch("date");
  const availableSlots = getAvailableSlots(slots, date);

  function onSubmit(values: PromotionFormValues) {
    createPromotion.mutate(values, {
      onSuccess: () => {
        toast.success("Flash sale berhasil dibuat.");
        router.push("/seller/promotions");
        router.refresh();
      },
      onError: (error) => {
        if (error instanceof ApiError) {
          if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
              form.setError(field as keyof PromotionFormValues, { message: messages[0] });
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
          <h2 className="text-base font-semibold">Informasi Flash Sale</h2>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Promosi</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: Flash Sale Akhir Pekan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Diskon</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih jenis diskon" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROMOTION_TYPES.map((option) => (
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
              name="discount_value"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>{type === "fixed_discount" ? "Nilai Diskon (Rp)" : "Nilai Diskon (%)"}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={type === "percentage_discount" ? 100 : undefined}
                      placeholder="0"
                      value={value ?? ""}
                      onChange={(e) => onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-base font-semibold">Jadwal</h2>
          <p className="text-sm text-muted-foreground">
            Flash sale mengikuti jam slot yang sudah ditentukan platform agar serentak dengan flash sale toko lain.
            Pilih tanggal terlebih dahulu untuk melihat slot yang masih tersedia.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      min={todayDateString()}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.setValue("flash_sale_slot_id", "");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="flash_sale_slot_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slot Waktu</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!date}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            !date
                              ? "Pilih tanggal dahulu"
                              : slotsLoading
                                ? "Memuat slot..."
                                : availableSlots.length === 0
                                  ? "Tidak ada slot tersedia"
                                  : "Pilih slot waktu"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableSlots.map((slot) => (
                        <SelectItem key={slot.id} value={slot.id}>
                          {slot.label} ({slot.start_time} - {slot.end_time})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-base font-semibold">Produk</h2>
          <FormField
            control={form.control}
            name="product_ids"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pilih Produk yang Ikut Flash Sale</FormLabel>
                <FormControl>
                  <PromotionProductSelect value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit" disabled={createPromotion.isPending}>
            {createPromotion.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Buat Flash Sale
          </Button>
        </div>
      </form>
    </Form>
  );
}
