import Link from "next/link";
import { Search, Sparkles, Store as StoreIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 sm:py-28">
        <div className="pointer-events-none absolute -top-32 -right-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.border)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Marketplace multiseller Indonesia
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Temukan Produk dan Layanan Terbaik di Sekitarmu
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Jelajahi ribuan produk dari restoran, toko retail, grosir, hingga jasa lokal — semua
            dalam satu platform.
          </p>

          <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full border border-border bg-card p-1.5 shadow-lg shadow-primary/5">
            <Search className="ml-3 h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              placeholder="Cari produk, toko, atau kategori..."
              className="border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <Button className="rounded-full px-6">Cari</Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/products">Jelajahi Produk</Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link href="/become-a-seller">
                <StoreIcon className="h-4 w-4" />
                Daftar Sebagai Seller
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-dashed border-border bg-surface p-12 text-center">
          <p className="text-sm text-muted-foreground">
            Promosi, kategori, produk terbaru, dan toko unggulan akan tampil di sini pada fase
            berikutnya.
          </p>
        </div>
      </section>
    </div>
  );
}
