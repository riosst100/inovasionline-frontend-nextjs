import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { HorizontalScrollCarousel } from "@/components/ui/horizontal-scroll-carousel";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { FlashSaleScheduleSlot, PublicProduct } from "@/types/product";

const SLOT_STATUS_LABEL: Record<FlashSaleScheduleSlot["status"], string> = {
  active: "Berlangsung",
  upcoming: "Akan Datang",
  ended: "Berakhir",
};

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    amount
  );
}

export function formatDateLabel(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  if (isSameDay(date, today)) return "Hari Ini";
  if (isSameDay(date, tomorrow)) return "Besok";

  return new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long" }).format(date);
}

export function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-white/15 px-1.5 font-mono text-base font-bold tabular-nums">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-1 text-[10px] uppercase tracking-wide opacity-80">{label}</span>
    </div>
  );
}

export function FlashSaleSlotTabsList({ slots }: { slots: FlashSaleScheduleSlot[] }) {
  return (
    <TabsList className="mb-4 h-auto w-full justify-start gap-2 overflow-x-auto bg-transparent p-0">
      {slots.map((slot) => (
        <TabsTrigger
          key={slot.id}
          value={slot.id}
          className="!h-auto flex-none flex-col gap-0.5 rounded-lg border border-border bg-muted/50 px-4 py-2 data-active:border-red-600 data-active:bg-red-600 data-active:text-white"
        >
          <span className="text-sm font-semibold">{slot.start_time}</span>
          <span className="text-[10px] text-current opacity-80">{SLOT_STATUS_LABEL[slot.status]}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
}

export function FlashSaleProductGrid({ products }: { products: PublicProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">Belum ada produk di slot ini.</p>
      </div>
    );
  }

  return (
    <HorizontalScrollCarousel>
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.slug}`}
          className="group flex min-w-0 flex-[0_0_40%] flex-col overflow-hidden rounded-xl border border-border transition-shadow hover:shadow-md sm:flex-[0_0_23%] lg:flex-[0_0_18%]"
        >
          <div className="relative aspect-square overflow-hidden bg-surface">
            {product.image_url && (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 18vw, (min-width: 640px) 23vw, 42vw"
                className="object-cover transition-transform group-hover:scale-105"
              />
            )}
            {product.discount_percent !== null && (
              <Badge className="absolute top-2 left-2 bg-red-600 text-white hover:bg-red-600">
                -{product.discount_percent}%
              </Badge>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-1.5 p-2.5">
            <p className="line-clamp-2 text-xs font-medium text-foreground sm:text-sm">{product.name}</p>

            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-red-600 sm:text-base">
                {formatRupiah(Number(product.sale_price ?? product.regular_price))}
              </span>
              {product.sale_price && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatRupiah(Number(product.regular_price))}
                </span>
              )}
            </div>

            {product.sold_count > 0 && (
              <p className="mt-auto text-[10px] text-muted-foreground">{product.sold_count} terjual</p>
            )}
          </div>
        </Link>
      ))}
    </HorizontalScrollCarousel>
  );
}
