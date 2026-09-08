"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
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
import { authService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/features/auth/schemas";
import { ApiError } from "@/types/api";
import { useState } from "react";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [done, setDone] = useState(false);
  const mutation = useMutation({ mutationFn: authService.resetPassword });

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", password_confirmation: "" },
  });

  function onSubmit(values: ResetPasswordFormValues) {
    mutation.mutate(
      { token, email, ...values },
      {
        onSuccess: () => setDone(true),
        onError: (error) => {
          toast.error(error instanceof ApiError ? error.message : "Terjadi kesalahan.");
        },
      }
    );
  }

  if (!token || !email) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="text-xl font-bold tracking-tight">Tautan Tidak Valid</h1>
        <p className="text-sm text-muted-foreground">
          Tautan reset password tidak valid atau sudah kedaluwarsa.
        </p>
        <Link href="/forgot-password" className="inline-block text-sm font-medium text-primary hover:underline">
          Minta tautan baru
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">Password Berhasil Diubah</h1>
        <p className="text-sm text-muted-foreground">
          Silakan masuk menggunakan password baru Anda.
        </p>
        <Button className="w-full" size="lg" onClick={() => router.push("/login")}>
          Ke Halaman Masuk
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Atur Ulang Password</h1>
          <p className="text-sm text-muted-foreground">Masukkan password baru untuk akun {email}</p>
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Baru</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konfirmasi Password</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" size="lg" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Simpan Password Baru
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-primary hover:underline">
            Kembali ke halaman masuk
          </Link>
        </p>
      </form>
    </Form>
  );
}
