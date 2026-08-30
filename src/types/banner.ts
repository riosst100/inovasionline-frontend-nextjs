export interface Banner {
  id: string;
  name: string;
  image_url: string;
  link_url: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface PublicBanner {
  id: string;
  name: string;
  image_url: string;
  link_url: string | null;
}

export interface BannerPayload {
  name: string;
  image?: File;
  link_url?: string;
  is_active?: boolean;
}
