import Image from "next/image";
import Link from "next/link";
import { Sparkles, Store as StoreIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryList } from "@/features/home/category-list";
import { LocationBar } from "@/features/location/location-bar";
import { GlobalSearch } from "@/features/search/global-search";
import { PromoBannerSlider } from "@/features/home/promo-banner-slider";
import { FlashSaleSection } from "@/features/home/flash-sale-section";
import { BestSellerSection } from "@/features/home/best-seller-section";
import { SellerListSection } from "@/features/home/seller-list-section";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden py-20 sm:py-28">
        <Image
          src="/banners/hero-food.svg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/30" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Marketplace kuliner lokal Indonesia
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Temukan Kuliner Favoritmu dari Resto dan Dapur Lokal
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">
            Jelajahi ribuan menu dari restoran, kafe, hingga dapur rumahan di sekitarmu — dan
            temukan produk lainnya dalam satu platform.
          </p>

          <GlobalSearch />

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/products">Jelajahi Kuliner</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              asChild
            >
              <Link href="/become-a-seller">
                <StoreIcon className="h-4 w-4" />
                Daftar Sebagai Seller
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <LocationBar />
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <CategoryList />
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <PromoBannerSlider />
      </section>

      <FlashSaleSection />

      <BestSellerSection />

      <SellerListSection />
    </div>
  );
}
