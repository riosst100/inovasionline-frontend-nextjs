"use client";

import { useQuery } from "@tanstack/react-query";
import { BannerFormDialog } from "@/features/admin/banner-form-dialog";
import { BannerList } from "@/features/admin/banner-list";
import { adminService } from "@/services/admin.service";

export default function AdminBannersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "banners"],
    queryFn: adminService.listBanners,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Banner</h1>
          <p className="text-sm text-muted-foreground">
            Kelola banner yang tampil di halaman utama marketplace. Seret untuk mengatur urutan.
          </p>
        </div>
        <BannerFormDialog />
      </div>

      <BannerList banners={data ?? []} isLoading={isLoading} />
    </div>
  );
}
