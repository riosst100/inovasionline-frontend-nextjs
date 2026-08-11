import { MarketplaceHeader } from "@/components/layout/marketplace-header";
import { MarketplaceFooter } from "@/components/layout/marketplace-footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { SellerApplicationBanner } from "@/features/seller/seller-application-banner";

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketplaceHeader />
      <SellerApplicationBanner />
      <main className="flex-1">{children}</main>
      <MarketplaceFooter />
      <MobileBottomNav />
    </div>
  );
}
