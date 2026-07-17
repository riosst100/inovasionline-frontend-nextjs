import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SellerSidebar } from "@/components/seller/seller-sidebar";
import { SellerTopbar } from "@/components/seller/seller-topbar";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SellerSidebar />
      <SidebarInset>
        <SellerTopbar />
        <main className="flex-1 bg-surface/40 p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
