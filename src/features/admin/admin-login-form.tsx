"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
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
import { useCurrentUser, useLogin } from "@/features/auth/use-auth";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas";
import { ApiError } from "@/types/api";

export function AdminLoginForm() {
  const router = useRouter();
  const login = useLogin();
  const { data: user, isLoading } = useCurrentUser();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  useEffect(() => {
    if (!isLoading && user?.role === "platform_admin") {
      router.replace("/admin/dashboard");
    }
  }, [isLoading, user, router]);

  function onSubmit(values: LoginFormValues) {
    login.mutate(values, {
      onSuccess: (user) => {
        if (user.role !== "platform_admin") {
          toast.error("Akun ini tidak memiliki akses admin.");
          return;
        }
        toast.success("Login berhasil!");
        router.push("/admin/dashboard");
        router.refresh();
      },
      onError: (error) => {
        if (error instanceof ApiError) {
          toast.error(error.message);
          return;
        }
        toast.error("Terjadi kesalahan. Silakan coba lagi.");
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Masuk dengan akun admin untuk melanjutkan</p>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="admin@email.com" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" autoComplete="current-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" size="lg" disabled={login.isPending}>
          {login.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Masuk
        </Button>
      </form>
    </Form>
  );
}
