import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan performa platform akan tampil di sini.
        </p>
      </div>

      <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">
          Statistik dashboard, grafik, dan aksi cepat akan diimplementasikan pada fase berikutnya.
        </p>
      </div>
    </div>
  );
}
