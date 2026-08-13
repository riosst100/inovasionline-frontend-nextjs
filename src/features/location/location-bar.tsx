"use client";

import { useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { ChangeLocationDialog } from "@/features/location/location-picker-dialog";
import { useSelectedLocation } from "@/features/location/use-selected-location";

export function LocationBar() {
  const { location } = useSelectedLocation();
  const [open, setOpen] = useState(false);

  if (!location) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-left text-sm transition-colors hover:bg-surface sm:w-fit"
      >
        <MapPin className="h-4 w-4 shrink-0 text-primary" />
        <span className="min-w-0 flex-1 truncate text-foreground">
          {location.villageName}, {location.districtName}, {location.cityName}
        </span>
        <span className="shrink-0 text-xs font-medium text-primary">Ubah</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      </button>

      <ChangeLocationDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
