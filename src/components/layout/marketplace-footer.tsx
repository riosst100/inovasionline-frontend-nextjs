import Link from "next/link";
import { Store } from "lucide-react";
import { Facebook, Instagram, Twitter } from "@/components/icons/social";

const FOOTER_LINKS = [
  {
    title: "Marketplace",
    links: [
      { href: "/stores", label: "Semua Toko" },
      { href: "/categories", label: "Kategori" },
      { href: "/promotions", label: "Promo" },
    ],
  },
  {
    title: "Untuk Seller",
    links: [
      { href: "/become-a-seller", label: "Mulai Berjualan" },
      { href: "/seller/dashboard", label: "Seller Center" },
    ],
  },
  {
    title: "Perusahaan",
    links: [
      { href: "#", label: "Tentang Kami" },
      { href: "#", label: "Kebijakan Privasi" },
      { href: "#", label: "Syarat & Ketentuan" },
    ],
  },
];

export function MarketplaceFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-surface pb-20 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Store className="h-4.5 w-4.5" />
              </div>
              <span className="text-lg font-bold tracking-tight">Inovasi Online</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Marketplace multiseller untuk restoran, toko retail, grosir, dan berbagai jenis usaha
              di sekitarmu.
            </p>
            <div className="mt-4 flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-muted-foreground shadow-sm transition-colors hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold">{group.title}</h3>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
          {new Date().getFullYear()} © Inovasi Online. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
