"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/features/search/use-debounced-value";
import { useSearchSuggestions } from "@/features/search/use-search";

export function GlobalSearch() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const debouncedQuery = useDebouncedValue(query, 300);
  const { data: suggestions } = useSearchSuggestions(debouncedQuery);

  function submitSearch(keyword: string) {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div ref={containerRef} className="relative mx-auto mt-8 max-w-xl">
      <div className="flex items-center gap-2 rounded-full border border-border bg-card p-1.5 shadow-lg shadow-black/10">
        <Search className="ml-3 h-4 w-4 shrink-0 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submitSearch(query);
          }}
          placeholder="Cari makanan, resto, atau kategori..."
          className="border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
        <Button className="rounded-full px-6" onClick={() => submitSearch(query)}>
          Cari
        </Button>
      </div>

      {open && suggestions && suggestions.length > 0 && (
        <div className="absolute top-full right-0 left-0 z-20 mt-2 overflow-hidden rounded-2xl border border-border bg-card py-1.5 text-left shadow-lg">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => submitSearch(suggestion)}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-surface"
            >
              <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
