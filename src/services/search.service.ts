import { apiGet } from "@/services/api-client";
import type { SearchResults } from "@/types/search";

export const searchService = {
  suggestions: (q: string, limit = 8) => apiGet<string[]>("/search/suggestions", { params: { q, limit } }),
  results: (q: string, limit = 24) => apiGet<SearchResults>("/search", { params: { q, limit } }),
};
