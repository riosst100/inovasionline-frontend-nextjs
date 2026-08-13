"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useCountdown } from "@/features/home/use-countdown";
import { useFlashSaleSchedule } from "@/features/home/use-public-products";
import {
  CountdownUnit,
  FlashSaleProductGrid,
  FlashSaleSlotTabsList,
  formatDateLabel,
} from "@/features/home/flash-sale-shared";
import type { FlashSaleScheduleSlot } from "@/types/product";

function ActiveSlotCountdown({ slot }: { slot: FlashSaleScheduleSlot }) {
  const targetTime = new Date(slot.ends_at).getTime();
  const countdown = useCountdown(targetTime);

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-sm font-medium opacity-90 sm:inline">Berakhir dalam</span>
      <div className="flex items-center gap-1">
        <CountdownUnit value={countdown.hours} label="Jam" />
        <span className="pb-4 font-bold">:</span>
        <CountdownUnit value={countdown.minutes} label="Menit" />
        <span className="pb-4 font-bold">:</span>
        <CountdownUnit value={countdown.seconds} label="Detik" />
      </div>
    </div>
  );
}

export function FlashSaleSection() {
  const { data, isLoading } = useFlashSaleSchedule();
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const slots = (data?.slots ?? []).filter((slot) => slot.products.length > 0);

  if (!isLoading && slots.length === 0) {
    return null;
  }

  const defaultSlotId =
    slots.find((slot) => slot.status === "active")?.id ??
    slots.find((slot) => slot.status === "upcoming")?.id ??
    slots[0]?.id;
  const activeSlotId = selectedSlotId && slots.some((slot) => slot.id === selectedSlotId) ? selectedSlotId : defaultSlotId;
  const activeSlot = slots.find((slot) => slot.id === activeSlotId);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 rounded-t-2xl bg-gradient-to-r from-red-600 to-orange-500 px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 fill-white" />
          <h2 className="text-lg font-bold sm:text-xl">Flash Sale</h2>
          {data?.date && <span className="text-sm opacity-90">{formatDateLabel(data.date)}</span>}
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          {activeSlot?.status === "active" && <ActiveSlotCountdown key={activeSlot.id} slot={activeSlot} />}
          <Link
            href="/promotions/flash-sale"
            className="shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium hover:bg-white/25"
          >
            Lihat Semua
          </Link>
        </div>
      </div>

      <div className="rounded-b-2xl border border-t-0 border-border bg-card p-4 sm:p-5">
        {isLoading ? (
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square min-w-0 flex-[0_0_40%] rounded-xl sm:flex-[0_0_23%] lg:flex-[0_0_18%]" />
            ))}
          </div>
        ) : (
          <Tabs value={activeSlotId ?? undefined} onValueChange={setSelectedSlotId}>
            <FlashSaleSlotTabsList slots={slots} />

            {slots.map((slot) => (
              <TabsContent key={slot.id} value={slot.id}>
                <FlashSaleProductGrid products={slot.products} />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </section>
  );
}
