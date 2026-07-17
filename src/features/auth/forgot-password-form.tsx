"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Loader2, MailCheck } from "lucide-react";
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
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/features/auth/schemas";
import { ApiError } from "@/types/api";
import { useState } from "react";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const mutation = useMutation({ mutationFn: authService.forgotPassword });

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ForgotPasswordFormValues) {
    mutation.mutate(values, {
      onSuccess: () => setSent(true),
      onError: (error) => {
        toast.error(error instanceof ApiError ? error.message : "Terjadi kesalahan.");
      },
    });
  }

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
          <MailCheck className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">Cek Email Anda</h1>
        <p className="text-sm text-muted-foreground">
          Jika email terdaftar, kami telah mengirimkan tautan untuk mengatur ulang password Anda.
        </p>
        <Link href="/login" className="inline-block text-sm font-medium text-primary hover:underline">
          Kembali ke halaman masuk
        </Link>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Lupa Password</h1>
          <p className="text-sm text-muted-foreground">
            Masukkan email Anda dan kami akan mengirimkan tautan untuk mengatur ulang password
          </p>
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

        <Button type="submit" className="w-full" size="lg" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Kirim Tautan Reset
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
