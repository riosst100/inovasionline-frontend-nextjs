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
import { useCurrentUser } from "@/features/auth/use-auth";
import { useSubmitVerification } from "@/features/account/use-user-verification";
import {
  userVerificationSchema,
  type UserVerificationFormValues,
} from "@/features/account/verification-schema";
import { ApiError } from "@/types/api";

export function VerificationForm() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const submitVerification = useSubmitVerification();

  const form = useForm<UserVerificationFormValues>({
    resolver: zodResolver(userVerificationSchema),
    defaultValues: {
      full_name: user?.name ?? "",
      id_number: "",
    },
  });

  function onSubmit(values: UserVerificationFormValues) {
    submitVerification.mutate(values, {
      onSuccess: () => {
        toast.success("Verifikasi berhasil dikirim! Kami akan meninjau dalam 1-2 hari kerja.");
        router.push("/account");
        router.refresh();
      },
      onError: (error) => {
        if (error instanceof ApiError) {
          if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
              form.setError(field as keyof UserVerificationFormValues, { message: messages[0] });
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap (sesuai KTP)</FormLabel>
              <FormControl>
                <Input placeholder="Nama lengkap Anda" autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="id_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor KTP (opsional)</FormLabel>
              <FormControl>
                <Input placeholder="16 digit NIK" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="selfie"
          render={({ field: { onChange, ref, name, onBlur } }) => (
            <FormItem>
              <FormLabel>Foto Wajah (Selfie)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/png,image/jpeg"
                  name={name}
                  ref={ref}
                  onBlur={onBlur}
                  onChange={(event) => onChange(event.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="document"
          render={({ field: { onChange, ref, name, onBlur } }) => (
            <FormItem>
              <FormLabel>Foto Dokumen Identitas (KTP)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/png,image/jpeg"
                  name={name}
                  ref={ref}
                  onBlur={onBlur}
                  onChange={(event) => onChange(event.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" size="lg" disabled={submitVerification.isPending}>
          {submitVerification.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Kirim Verifikasi
        </Button>
      </form>
    </Form>
  );
}
