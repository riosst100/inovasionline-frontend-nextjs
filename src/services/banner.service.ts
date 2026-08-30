import { apiGet } from "@/services/api-client";
import type { PublicBanner } from "@/types/banner";

export const bannerService = {
  list: () => apiGet<PublicBanner[]>("/banners"),
};
