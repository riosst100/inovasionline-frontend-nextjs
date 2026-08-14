"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  KeyRound,
  LogOut,
  Mail,
  PackageSearch,
  Phone,
  Settings,
  ShieldCheck,
  ShoppingBag,
  User as UserIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useCurrentUser, useLogout } from "@/features/auth/use-auth";
import { EditProfileDialog } from "@/features/account/edit-profile-dialog";
import type { User } from "@/types/auth";

const ROLE_LABEL: Record<string, string> = {
  customer: "Pembeli",
  seller_owner: "Pemilik Toko",
  seller_staff: "Staf Toko",
  platform_admin: "Admin Platform",
};

type SectionKey = "profile" | "orders" | "settings";

function SectionRow({
  icon: Icon,
  label,
  description,
  open,
  onToggle,
  children,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <Collapsible open={open} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <button type="button" className="flex w-full items-center gap-3 px-4 py-4 text-left">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t border-border px-4 py-4">{children}</div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

function ProfileContent({ user }: { user: User }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={user.avatar_url ?? undefined} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-base font-semibold">{user.name}</p>
            <Badge variant="secondary" className="mt-1">
              {ROLE_LABEL[user.role] ?? user.role}
            </Badge>
          </div>
        </div>
        <EditProfileDialog user={user} />
      </div>

      <div className="space-y-4 border-t border-border pt-4">
        <div className="flex items-center gap-3">
          <UserIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Nama Lengkap</p>
            <p className="text-sm font-medium">{user.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm font-medium">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Nomor Telepon</p>
            <p className="text-sm font-medium">{user.phone ?? "Belum diatur"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ShieldCheck className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Status Email</p>
            <p className="text-sm font-medium">
              {user.email_verified_at ? "Terverifikasi" : "Belum terverifikasi"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersContent() {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <PackageSearch className="h-10 w-10 text-muted-foreground" />
      <div>
        <p className="text-sm font-medium">Belum ada pesanan</p>
        <p className="text-xs text-muted-foreground">Pesanan yang Anda buat akan muncul di sini</p>
      </div>
      <Button asChild size="sm" className="mt-1">
        <Link href="/">Mulai Belanja</Link>
      </Button>
    </div>
  );
}

function SettingsContent({ user }: { user: User | undefined }) {
  const logout = useLogout();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <KeyRound className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Password</p>
            <p className="text-xs text-muted-foreground">Kirim tautan ubah password ke email Anda</p>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/forgot-password">Ubah Password</Link>
        </Button>
      </div>

      {user && (
        <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
          <div className="flex items-center gap-3">
            <LogOut className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Keluar dari Akun</p>
              <p className="text-xs text-muted-foreground">Akhiri sesi Anda di perangkat ini</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            Keluar
          </Button>
        </div>
      )}
    </div>
  );
}

export function AccountSections() {
  const { data: user, isLoading } = useCurrentUser();
  const [openSection, setOpenSection] = useState<SectionKey | null>("profile");

  function toggle(key: SectionKey) {
    setOpenSection((current) => (current === key ? null : key));
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-muted text-lg font-semibold text-muted-foreground">
              <UserIcon className="h-7 w-7" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Anda belum masuk</p>
            <p className="text-sm text-muted-foreground">
              Masuk atau daftar untuk melihat dan mengelola akun Anda
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Daftar</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <SectionRow
        icon={UserIcon}
        label="Profil Saya"
        description="Lihat dan kelola informasi profil Anda"
        open={openSection === "profile"}
        onToggle={() => toggle("profile")}
      >
        <ProfileContent user={user} />
      </SectionRow>

      <SectionRow
        icon={ShoppingBag}
        label="Pesanan Saya"
        description="Lihat riwayat dan status pesanan Anda"
        open={openSection === "orders"}
        onToggle={() => toggle("orders")}
      >
        <OrdersContent />
      </SectionRow>

      <SectionRow
        icon={Settings}
        label="Pengaturan"
        description="Kelola keamanan dan preferensi akun Anda"
        open={openSection === "settings"}
        onToggle={() => toggle("settings")}
      >
        <SettingsContent user={user} />
      </SectionRow>
    </div>
  );
}
