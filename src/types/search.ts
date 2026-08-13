import type { PublicProduct, PublicStore } from "@/types/product";

export interface SearchResults {
  products: PublicProduct[];
  stores: PublicStore[];
}
