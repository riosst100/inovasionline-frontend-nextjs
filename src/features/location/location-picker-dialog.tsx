"use client";

import { useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCities, useDistricts, useProvinces, useVillages } from "@/features/location/use-regions";
import { useSelectedLocation } from "@/features/location/use-selected-location";
import type { Region, SelectedLocation } from "@/types/region";

function findRegion(regions: Region[] | undefined, code: string): Region | undefined {
  return regions?.find((region) => region.code === code);
}

interface RegionSelectProps {
  placeholder: string;
  value: string | null;
  onValueChange: (value: string) => void;
  disabled: boolean;
  loading: boolean;
  regions: Region[] | undefined;
}

function RegionSelect({ placeholder, value, onValueChange, disabled, loading, regions }: RegionSelectProps) {
  return (
    <div className="relative">
      <Select value={value ?? undefined} onValueChange={onValueChange} disabled={disabled || loading}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={loading ? "Memuat..." : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {regions?.map((region) => (
            <SelectItem key={region.code} value={region.code}>
              {region.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {loading && (
        <Loader2 className="pointer-events-none absolute top-1/2 right-8 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
      )}
    </div>
  );
}

interface LocationPickerFormProps {
  initialLocation?: SelectedLocation | null;
  onSaved: () => void;
}

function LocationPickerForm({ initialLocation, onSaved }: LocationPickerFormProps) {
  const { setLocation } = useSelectedLocation();

  const [provinceCode, setProvinceCode] = useState<string | null>(initialLocation?.provinceCode ?? null);
  const [cityCode, setCityCode] = useState<string | null>(initialLocation?.cityCode ?? null);
  const [districtCode, setDistrictCode] = useState<string | null>(initialLocation?.districtCode ?? null);
  const [villageCode, setVillageCode] = useState<string | null>(initialLocation?.villageCode ?? null);

  const { data: provinces, isLoading: loadingProvinces } = useProvinces();
  const { data: cities, isLoading: loadingCities } = useCities(provinceCode);
  const { data: districts, isLoading: loadingDistricts } = useDistricts(cityCode);
  const { data: villages, isLoading: loadingVillages } = useVillages(districtCode);

  const canSubmit = Boolean(provinceCode && cityCode && districtCode && villageCode);

  function handleProvinceChange(value: string) {
    setProvinceCode(value);
    setCityCode(null);
    setDistrictCode(null);
    setVillageCode(null);
  }

  function handleCityChange(value: string) {
    setCityCode(value);
    setDistrictCode(null);
    setVillageCode(null);
  }

  function handleDistrictChange(value: string) {
    setDistrictCode(value);
    setVillageCode(null);
  }

  function handleSubmit() {
    const province = findRegion(provinces, provinceCode ?? "");
    const city = findRegion(cities, cityCode ?? "");
    const district = findRegion(districts, districtCode ?? "");
    const village = findRegion(villages, villageCode ?? "");

    if (!province || !city || !district || !village) return;

    setLocation({
      provinceCode: province.code,
      provinceName: province.name,
      cityCode: city.code,
      cityName: city.name,
      districtCode: district.code,
      districtName: district.name,
      villageCode: village.code,
      villageName: village.name,
    });

    onSaved();
  }

  const isLoadingAny = loadingProvinces || loadingCities || loadingDistricts || loadingVillages;

  return (
    <>
      <div className="flex flex-col gap-3">
        <RegionSelect
          placeholder="Pilih provinsi"
          value={provinceCode}
          onValueChange={handleProvinceChange}
          disabled={false}
          loading={loadingProvinces}
          regions={provinces}
        />

        <RegionSelect
          placeholder="Pilih kota/kabupaten"
          value={cityCode}
          onValueChange={handleCityChange}
          disabled={!provinceCode}
          loading={loadingCities}
          regions={cities}
        />

        <RegionSelect
          placeholder="Pilih kecamatan"
          value={districtCode}
          onValueChange={handleDistrictChange}
          disabled={!cityCode}
          loading={loadingDistricts}
          regions={districts}
        />

        <RegionSelect
          placeholder="Pilih kelurahan/desa"
          value={villageCode}
          onValueChange={setVillageCode}
          disabled={!districtCode}
          loading={loadingVillages}
          regions={villages}
        />
      </div>

      <Button className="w-full" disabled={!canSubmit || isLoadingAny} onClick={handleSubmit}>
        {isLoadingAny && <Loader2 className="h-4 w-4 animate-spin" />}
        Simpan Lokasi
      </Button>
    </>
  );
}

export function LocationPickerDialog() {
  const { location } = useSelectedLocation();

  if (location) return null;

  return (
    <Dialog open>
      <DialogContent showCloseButton={false} onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MapPin className="h-5 w-5" />
          </div>
          <DialogTitle className="text-center">Pilih Lokasi Anda</DialogTitle>
          <DialogDescription className="text-center">
            Kami butuh lokasi Anda untuk menampilkan toko dan produk terdekat.
          </DialogDescription>
        </DialogHeader>

        <LocationPickerForm onSaved={() => {}} />
      </DialogContent>
    </Dialog>
  );
}

interface ChangeLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangeLocationDialog({ open, onOpenChange }: ChangeLocationDialogProps) {
  const { location } = useSelectedLocation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MapPin className="h-5 w-5" />
          </div>
          <DialogTitle className="text-center">Ubah Lokasi</DialogTitle>
          <DialogDescription className="text-center">
            Pilih lokasi baru untuk menampilkan toko dan produk terdekat.
          </DialogDescription>
        </DialogHeader>

        {open && <LocationPickerForm initialLocation={location} onSaved={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}
