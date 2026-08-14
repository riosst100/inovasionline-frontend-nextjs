"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
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
import { useUpdateProfile } from "@/features/auth/use-auth";
import { updateProfileSchema, type UpdateProfileFormValues } from "@/features/auth/schemas";
import { ApiError } from "@/types/api";
import type { User } from "@/types/auth";

export function EditProfileDialog({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const updateProfile = useUpdateProfile();

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user.name, phone: user.phone ?? "" },
  });

  useEffect(() => {
    if (open) {
      form.reset({ name: user.name, phone: user.phone ?? "" });
    }
  }, [open, user, form]);

  function onSubmit(values: UpdateProfileFormValues) {
    updateProfile.mutate(values, {
      onSuccess: () => {
        toast.success("Profil berhasil diperbarui.");
        setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Pencil className="h-4 w-4" />
          Edit Profil
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profil</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
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
                    <Input placeholder="08xxxxxxxxxx" autoComplete="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
