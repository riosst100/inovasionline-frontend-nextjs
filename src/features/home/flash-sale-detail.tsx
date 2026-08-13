"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useFlashSaleSchedule } from "@/features/home/use-public-products";
import { FlashSaleProductGrid, FlashSaleSlotTabsList, formatDateLabel } from "@/features/home/flash-sale-shared";

export function FlashSaleDetail() {
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const { data, isLoading } = useFlashSaleSchedule(selectedDate);

  const availableDates = data?.available_dates ?? [];
  const slots = (data?.slots ?? []).filter((slot) => slot.products.length > 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-2">
        <Zap className="h-6 w-6 text-red-600" />
        <h1 className="text-2xl font-bold">Flash Sale</h1>
      </div>

      {isLoading && !data ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full max-w-md" />
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square min-w-0 flex-[0_0_40%] rounded-xl sm:flex-[0_0_23%] lg:flex-[0_0_18%]" />
            ))}
          </div>
        </div>
      ) : !data?.date ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-card p-16 text-center">
          <Zap className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Belum ada flash sale yang dijadwalkan.</p>
        </div>
      ) : (
        <>
          {availableDates.length > 1 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {availableDates.map((date) => (
                <button
                  key={date}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                    (selectedDate ?? data.date) === date
                      ? "border-red-600 bg-red-600 text-white"
                      : "border-border bg-card text-foreground hover:bg-muted"
                  )}
                >
                  {formatDateLabel(date)}
                </button>
              ))}
            </div>
          )}

          {slots.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-card p-16 text-center">
              <Zap className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Belum ada produk pada tanggal ini.</p>
            </div>
          ) : (
            <Tabs defaultValue={slots[0]?.id}>
              <FlashSaleSlotTabsList slots={slots} />

              {slots.map((slot) => (
                <TabsContent key={slot.id} value={slot.id}>
                  <FlashSaleProductGrid products={slot.products} />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </>
      )}
    </div>
  );
}
