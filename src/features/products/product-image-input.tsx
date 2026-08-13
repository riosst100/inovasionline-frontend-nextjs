"use client";

import { useEffect, useMemo } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageInputProps {
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
}

export function ProductImageInput({ value, onChange, maxFiles = 8 }: ProductImageInputProps) {
  const previews = useMemo(() => value.map((file) => URL.createObjectURL(file)), [value]);

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    onChange([...value, ...files].slice(0, maxFiles));
    e.target.value = "";
  }

  function handleRemove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
      {previews.map((url, index) => (
        <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
          {index === 0 && (
            <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
              Utama
            </span>
          )}
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 transition-opacity group-hover:opacity-100"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}

      {value.length < maxFiles && (
        <label
          className={cn(
            "flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:bg-muted/50"
          )}
        >
          <ImagePlus className="h-5 w-5" />
          <span className="text-[11px]">Tambah</span>
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleSelect} />
        </label>
      )}
    </div>
  );
}
