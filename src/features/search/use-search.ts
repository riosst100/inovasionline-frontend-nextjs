"use client";

import { useQuery } from "@tanstack/react-query";
import { searchService } from "@/services/search.service";

export const SEARCH_QUERY_KEY = ["search"] as const;

export function useSearchSuggestions(query: string) {
  const trimmed = query.trim();

  return useQuery({
    queryKey: [...SEARCH_QUERY_KEY, "suggestions", trimmed],
    queryFn: () => searchService.suggestions(trimmed),
    staleTime: 60 * 1000,
    enabled: trimmed.length > 0,
  });
}

export function useSearchResults(query: string) {
  const trimmed = query.trim();

  return useQuery({
    queryKey: [...SEARCH_QUERY_KEY, "results", trimmed],
    queryFn: () => searchService.results(trimmed),
    staleTime: 60 * 1000,
    enabled: trimmed.length > 0,
  });
}
