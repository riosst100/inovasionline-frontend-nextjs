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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentUser } from "@/features/auth/use-auth";
import { useApplyAsSeller } from "@/features/seller/use-seller-application";
import { sellerApplicationSchema, type SellerApplicationFormValues } from "@/features/seller/schemas";
import { ApiError } from "@/types/api";

export function SellerApplicationForm() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const applyAsSeller = useApplyAsSeller();

  const form = useForm<SellerApplicationFormValues>({
    resolver: zodResolver(sellerApplicationSchema),
    defaultValues: {
      full_name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      store_name: "",
      business_type: undefined,
      business_description: "",
      address: "",
      province: "",
      city: "",
      district: "",
      postal_code: "",
    },
  });

  function onSubmit(values: SellerApplicationFormValues) {
    applyAsSeller.mutate(values, {
      onSuccess: () => {
        toast.success("Pengajuan berhasil dikirim! Kami akan meninjau dalam 1-2 hari kerja.");
        router.push("/");
        router.refresh();
      },
      onError: (error) => {
        if (error instanceof ApiError) {
          if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
              form.setError(field as keyof SellerApplicationFormValues, { message: messages[0] });
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
          <h2 className="text-base font-semibold">Informasi Pribadi</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama lengkap Anda" autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Telepon</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="0812xxxxxxxx" autoComplete="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="nama@email.com" autoComplete="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-base font-semibold">Informasi Toko</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="store_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Toko</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama toko Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="business_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Usaha</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih jenis usaha" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="individual">Perorangan</SelectItem>
                      <SelectItem value="company">Perusahaan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="business_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi Usaha (opsional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ceritakan tentang produk atau usaha yang akan Anda jual"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-base font-semibold">Alamat Toko</h2>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat Lengkap</FormLabel>
                <FormControl>
                  <Input placeholder="Nama jalan, nomor, RT/RW" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provinsi</FormLabel>
                  <FormControl>
                    <Input placeholder="Provinsi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kota/Kabupaten</FormLabel>
                  <FormControl>
                    <Input placeholder="Kota/Kabupaten" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kecamatan (opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Kecamatan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postal_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Pos (opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Kode pos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <Button type="submit" className="w-full" size="lg" disabled={applyAsSeller.isPending}>
          {applyAsSeller.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Kirim Pengajuan
        </Button>
      </form>
    </Form>
  );
}
