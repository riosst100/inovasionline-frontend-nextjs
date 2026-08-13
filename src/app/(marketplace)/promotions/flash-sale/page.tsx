import type { Metadata } from "next";
import { FlashSaleDetail } from "@/features/home/flash-sale-detail";

export const metadata: Metadata = {
  title: "Flash Sale",
};

export default function FlashSalePage() {
  return <FlashSaleDetail />;
}
