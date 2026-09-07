"use client";

import { use } from "react";
import { CopyTemplateDialog } from "@/features/seller/copy-template-dialog";
import { RateRowManager } from "@/features/shipping-rates/rate-row-manager";
import {
  useCreateShippingMethodRate,
  useDeleteShippingMethodRate,
  useImportShippingMethodRates,
  useShippingMethodRates,
  useShippingMethods,
} from "@/features/seller/use-shipping-methods";
import { shippingMethodService } from "@/services/shipping-method.service";

export default function SellerShippingMethodRatesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: methods } = useShippingMethods();
  const method = methods?.find((m) => m.id === id);

  const { data: rows, isLoading } = useShippingMethodRates(id);
  const createRate = useCreateShippingMethodRate(id);
  const deleteRate = useDeleteShippingMethodRate(id);
  const importRates = useImportShippingMethodRates(id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kelola Tarif — {method?.name ?? ""}</h1>
        <p className="text-sm text-muted-foreground">
          Tarif ini berlaku untuk pengiriman lokal (kurir toko/aplikasi). Untuk luar kota, gunakan metode ekspedisi dengan tarif flat.
        </p>
      </div>

      <RateRowManager
        rows={rows ?? []}
        isLoading={isLoading}
        exportUrl={shippingMethodService.exportRatesUrl(id)}
        onCreateRow={(payload) => createRate.mutateAsync(payload)}
        onDeleteRow={(rateId) => deleteRate.mutateAsync(rateId)}
        onImport={(file) => importRates.mutateAsync(file)}
        extraAction={<CopyTemplateDialog shippingMethodId={id} />}
      />
    </div>
  );
}
