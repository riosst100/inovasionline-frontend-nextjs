"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  Search,
  Store,
  User,
  ChevronDown,
  Package,
  ShoppingBag,
  Sparkles,
  LayoutGrid,
  Tag,
  LogOut,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useCurrentUser, useLogout } from "@/features/auth/use-auth";
import { useAdminToolbarVisible } from "@/features/admin/use-admin-toolbar";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/categories", label: "Kategori" },
  { href: "/stores", label: "Toko" },
  { href: "/promotions", label: "Promo" },
];

export function MarketplaceHeader() {
  const { data: user, isLoading } = useCurrentUser();
  const logout = useLogout();
  const [mobileOpen, setMobileOpen] = useState(false);
  const adminToolbarVisible = useAdminToolbarVisible();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        adminToolbarVisible && "top-9"
      )}
    >
      {/* Desktop top row */}
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/30">
            <Store className="h-4.5 w-4.5" />
          </div>
          <span className="hidden text-lg font-bold tracking-tight sm:block">Inovasi Online</span>
        </Link>

        {/* Center search - desktop only */}
        <div className="hidden flex-1 items-center gap-2 md:flex">
          <div className="flex w-full max-w-2xl items-center rounded-full border border-border bg-surface pl-4 shadow-sm focus-within:ring-2 focus-within:ring-ring">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari produk, toko, atau kategori..."
              className="border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <Button size="sm" className="mr-1 rounded-full px-4">
              Cari
            </Button>
          </div>
        </div>

        {/* Mobile search trigger */}
        <div className="ml-auto flex items-center gap-1.5 md:hidden">
          <Button variant="ghost" size="icon" aria-label="Cari">
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Right side - desktop */}
        <div className="ml-auto hidden items-center gap-2 md:flex">
          {isLoading ? (
            <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            <AuthedMenu
              userName={user.name}
              avatarUrl={user.avatar_url}
              isSeller={user.is_seller}
              onLogout={() => logout.mutate()}
            />
          ) : (
            <GuestMenu />
          )}
        </div>

        {/* Mobile menu trigger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 gap-0 p-0">
            <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
            <MobileMenu
              user={user ?? null}
              onLogout={() => {
                logout.mutate();
                setMobileOpen(false);
              }}
              onNavigate={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Nav row - desktop */}
      <div className="hidden border-t border-border/60 bg-surface/60 md:block">
        <nav className="mx-auto flex h-11 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function GuestMenu() {
  return (
    <>
      <Button variant="ghost" asChild>
        <Link href="/login">Masuk</Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href="/register">Daftar</Link>
      </Button>
      <Button asChild className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-md shadow-accent/30 hover:opacity-90">
        <Link href="/become-a-seller">Jadi Seller</Link>
      </Button>
    </>
  );
}

function AuthedMenu({
  userName,
  avatarUrl,
  isSeller,
  onLogout,
}: {
  userName: string;
  avatarUrl: string | null;
  isSeller: boolean;
  onLogout: () => void;
}) {
  return (
    <>
      {isSeller ? (
        <Button asChild className="bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-md shadow-primary/30 hover:opacity-90">
          <Link href="/seller/dashboard">
            <LayoutDashboard className="h-4 w-4" />
            Seller Center
          </Link>
        </Button>
      ) : (
        <Button variant="outline" asChild>
          <Link href="/become-a-seller">Jadi Seller</Link>
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 rounded-full pl-2 pr-3">
            <Avatar className="h-7 w-7">
              <AvatarImage src={avatarUrl ?? undefined} alt={userName} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {userName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-24 truncate text-sm font-medium">{userName}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/account">
              <User className="h-4 w-4" />
              Profil Saya
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account">
              <Package className="h-4 w-4" />
              Pesanan Saya
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account">
              <Settings className="h-4 w-4" />
              Pengaturan
            </Link>
          </DropdownMenuItem>
          {!isSeller && (
            <DropdownMenuItem asChild>
              <Link href="/become-a-seller">
                <Store className="h-4 w-4" />
                Jadi Seller
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={onLogout}>
            <LogOut className="h-4 w-4" />
            Keluar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

function MobileMenu({
  user,
  onLogout,
  onNavigate,
}: {
  user: { name: string; is_seller: boolean; avatar_url: string | null } | null;
  onLogout: () => void;
  onNavigate: () => void;
}) {
  const links = [
    { href: "/", label: "Beranda", icon: ShoppingBag },
    { href: "/categories", label: "Kategori", icon: LayoutGrid },
    { href: "/stores", label: "Toko", icon: Store },
    { href: "/promotions", label: "Promo", icon: Tag },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-5 pt-14 pb-4">
        {user && (
          <div className="mb-5 flex items-center gap-3 rounded-xl bg-surface p-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar_url ?? undefined} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{user.name}</p>
              <Link href="/account" className="text-xs text-muted-foreground" onClick={onNavigate}>
                Lihat profil
              </Link>
            </div>
          </div>
        )}

        <nav className="flex flex-col gap-0.5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
            >
              <link.icon className="h-4 w-4 text-muted-foreground" />
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-border/60 px-5 py-4">
        {user ? (
          <div className="flex flex-col gap-2">
            {user.is_seller ? (
              <Button asChild className="bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-md shadow-primary/30 hover:opacity-90">
                <Link href="/seller/dashboard" onClick={onNavigate}>
                  <Sparkles className="h-4 w-4" />
                  Seller Center
                </Link>
              </Button>
            ) : (
              <Button asChild className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-md shadow-accent/30 hover:opacity-90">
                <Link href="/become-a-seller" onClick={onNavigate}>
                  <Store className="h-4 w-4" />
                  Jadi Seller
                </Link>
              </Button>
            )}
            <Button variant="ghost" className="justify-start text-destructive hover:bg-destructive/10" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
              Keluar
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Button variant="outline" asChild>
              <Link href="/login" onClick={onNavigate}>
                Masuk
              </Link>
            </Button>
            <Button asChild>
              <Link href="/register" onClick={onNavigate}>
                Daftar
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-md shadow-accent/30 hover:opacity-90">
              <Link href="/become-a-seller" onClick={onNavigate}>
                <Store className="h-4 w-4" />
                Jadi Seller
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
