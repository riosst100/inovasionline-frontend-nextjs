"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
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
import { adminService } from "@/services/admin.service";
import { ApiError } from "@/types/api";

const FLASH_SALE_SLOTS_QUERY_KEY = ["admin", "flash-sale-slots"];

const flashSaleSlotSchema = z
  .object({
    label: z.string().min(1, "Nama slot wajib diisi").max(255),
    start_time: z.string().min(1, "Jam mulai wajib diisi"),
    end_time: z.string().min(1, "Jam selesai wajib diisi"),
  })
  .refine((data) => data.end_time > data.start_time, {
    message: "Jam selesai harus setelah jam mulai",
    path: ["end_time"],
  });

type FlashSaleSlotFormValues = z.infer<typeof flashSaleSlotSchema>;

export function FlashSaleSlotFormDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FlashSaleSlotFormValues>({
    resolver: zodResolver(flashSaleSlotSchema),
    defaultValues: { label: "", start_time: "", end_time: "" },
  });

  const createSlot = useMutation({
    mutationFn: adminService.createFlashSaleSlot,
    onSuccess: () => {
      toast.success("Slot flash sale berhasil dibuat.");
      queryClient.invalidateQueries({ queryKey: FLASH_SALE_SLOTS_QUERY_KEY });
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        if (error.errors) {
          Object.entries(error.errors).forEach(([field, messages]) => {
            form.setError(field as keyof FlashSaleSlotFormValues, { message: messages[0] });
          });
          return;
        }
        toast.error(error.message);
        return;
      }
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    },
  });

  function onSubmit(values: FlashSaleSlotFormValues) {
    createSlot.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">
          <Plus />
          Tambah Slot
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Slot Flash Sale</DialogTitle>
          <DialogDescription>
            Slot ini akan berulang setiap hari pada jam yang ditentukan.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Slot</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Siang" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jam Mulai</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jam Selesai</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={createSlot.isPending}>
                {createSlot.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
