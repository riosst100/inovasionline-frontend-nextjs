import Image from "next/image";
import Link from "next/link";
import { Star, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HorizontalScrollCarousel } from "@/components/ui/horizontal-scroll-carousel";

interface BestSellerProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  soldCount: number;
  storeName: string;
}

const BEST_SELLER_PRODUCTS: BestSellerProduct[] = [
  {
    id: "7",
    name: "Sepatu Sneakers Casual Unisex",
    image: "/products/placeholder-1.svg",
    price: 175000,
    rating: 4.8,
    soldCount: 2300,
    storeName: "Toko Sport Jaya",
  },
  {
    id: "8",
    name: "Powerbank 10000mAh Fast Charging",
    image: "/products/placeholder-2.svg",
    price: 129000,
    rating: 4.9,
    soldCount: 1800,
    storeName: "Elektronik Mandiri",
  },
  {
    id: "9",
    name: "Skincare Set Wajah Glowing 5 in 1",
    image: "/products/placeholder-3.svg",
    price: 89000,
    rating: 4.7,
    soldCount: 3100,
    storeName: "Beauty Corner",
  },
  {
    id: "10",
    name: "Kursi Kerja Ergonomis Mesh",
    image: "/products/placeholder-4.svg",
    price: 620000,
    rating: 4.6,
    soldCount: 540,
    storeName: "Furnitura Rumah",
  },
  {
    id: "11",
    name: "Headset Bluetooth Noise Cancelling",
    image: "/products/placeholder-1.svg",
    price: 210000,
    rating: 4.8,
    soldCount: 1450,
    storeName: "Elektronik Mandiri",
  },
];

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    amount
  );
}

function formatSoldCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)}rb`;
  }
  return String(count);
}

export function BestSellerSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold sm:text-xl">Produk Terlaris</h2>
        </div>
        <Link href="/products?sort=best-selling" className="text-sm font-medium text-primary hover:underline">
          Lihat Semua
        </Link>
      </div>

      <HorizontalScrollCarousel>
        {BEST_SELLER_PRODUCTS.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group flex min-w-0 flex-[0_0_40%] flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md sm:flex-[0_0_23%] lg:flex-[0_0_18%]"
          >
            <div className="relative aspect-square overflow-hidden bg-surface">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 18vw, (min-width: 640px) 23vw, 42vw"
                className="object-cover transition-transform group-hover:scale-105"
              />
              <Badge className="absolute top-2 left-2 gap-1 bg-primary text-primary-foreground hover:bg-primary">
                <TrendingUp className="h-3 w-3" />
                Terlaris
              </Badge>
            </div>

            <div className="flex flex-1 flex-col gap-1.5 p-2.5">
              <p className="line-clamp-2 text-xs font-medium text-foreground sm:text-sm">{product.name}</p>
              <p className="truncate text-xs text-muted-foreground">{product.storeName}</p>

              <span className="text-sm font-bold text-foreground sm:text-base">
                {formatRupiah(product.price)}
              </span>

              <div className="mt-auto flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-warning text-warning" />
                <span>{product.rating}</span>
                <span>·</span>
                <span>{formatSoldCount(product.soldCount)} terjual</span>
              </div>
            </div>
          </Link>
        ))}
      </HorizontalScrollCarousel>
    </section>
  );
}
