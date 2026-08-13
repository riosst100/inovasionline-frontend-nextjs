import Image from "next/image";
import Link from "next/link";
import { MapPin, Sparkles, Store as StoreIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PublicStore } from "@/types/product";

interface SellerCardProps {
  store: PublicStore;
  className?: string;
}

export function SellerCard({ store, className }: SellerCardProps) {
  return (
    <Link
      href={`/stores/${store.slug}`}
      className={cn(
        "group flex min-w-0 flex-[0_0_65%] flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md sm:flex-[0_0_38%] lg:flex-[0_0_28%]",
        className
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-surface">
        {store.cover_url ? (
          <Image
            src={store.cover_url}
            alt={store.name}
            fill
            sizes="(min-width: 1024px) 28vw, (min-width: 640px) 38vw, 65vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <StoreIcon className="h-8 w-8" />
          </div>
        )}
        {store.is_featured && (
          <Badge className="absolute top-2 left-2 gap-1 bg-primary text-primary-foreground hover:bg-primary">
            <Sparkles className="h-3 w-3" />
            Unggulan
          </Badge>
        )}
      </div>

      <div className="flex flex-1 items-center gap-3 p-3">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-border bg-surface">
          {store.logo_url ? (
            <Image src={store.logo_url} alt="" fill sizes="44px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <StoreIcon className="h-4 w-4" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{store.name}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {store.city ? (
              <>
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{store.city}</span>
              </>
            ) : (
              <span className="truncate">{store.product_count} produk</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
