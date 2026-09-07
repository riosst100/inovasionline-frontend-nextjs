"use client";

import { useRef, useState } from "react";
import { Download, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/data-table/data-table";
import { useCities, useDistricts, useProvinces, useVillages } from "@/features/location/use-regions";
import { env } from "@/config/env";
import { ApiError } from "@/types/api";
import type { RateImportResult } from "@/types/shipping-rate";

interface RateRow {
  id: string;
  district_code: string | null;
  district_name: string | null;
  village_code: string | null;
  village_name: string | null;
  fee: number;
}

interface RateRowManagerProps {
  rows: RateRow[];
  isLoading: boolean;
  exportUrl: string;
  onCreateRow: (payload: { district_code?: string; village_code?: string; fee: number }) => Promise<unknown>;
  onDeleteRow: (rowId: string) => Promise<unknown>;
  onImport: (file: File) => Promise<RateImportResult>;
  extraAction?: React.ReactNode;
}

function getErrorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
}

function AddRowDialog({ onCreateRow }: { onCreateRow: RateRowManagerProps["onCreateRow"] }) {
  const [open, setOpen] = useState(false);
  const [provinceCode, setProvinceCode] = useState<string | null>(null);
  const [cityCode, setCityCode] = useState<string | null>(null);
  const [districtCode, setDistrictCode] = useState<string | null>(null);
  const [villageCode, setVillageCode] = useState<string | null>(null);
  const [scope, setScope] = useState<"district" | "village">("district");
  const [fee, setFee] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: provinces } = useProvinces();
  const { data: cities } = useCities(provinceCode);
  const { data: districts } = useDistricts(cityCode);
  const { data: villages } = useVillages(districtCode);

  function reset() {
    setProvinceCode(null);
    setCityCode(null);
    setDistrictCode(null);
    setVillageCode(null);
    setScope("district");
    setFee("");
  }

  async function handleSubmit() {
    if (!districtCode || !fee) return;

    setSubmitting(true);
    try {
      await onCreateRow({
        district_code: districtCode,
        village_code: scope === "village" ? (villageCode ?? undefined) : undefined,
        fee: Number(fee),
      });
      toast.success("Tarif berhasil disimpan.");
      reset();
      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          <Plus />
          Tambah Baris
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Tarif</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Select value={provinceCode ?? ""} onValueChange={(v) => { setProvinceCode(v); setCityCode(null); setDistrictCode(null); setVillageCode(null); }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Provinsi" />
              </SelectTrigger>
              <SelectContent>
                {provinces?.map((p) => (
                  <SelectItem key={p.code} value={p.code}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={cityCode ?? ""} onValueChange={(v) => { setCityCode(v); setDistrictCode(null); setVillageCode(null); }} disabled={!provinceCode}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Kabupaten/Kota" />
              </SelectTrigger>
              <SelectContent>
                {cities?.map((c) => (
                  <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Select value={districtCode ?? ""} onValueChange={(v) => { setDistrictCode(v); setVillageCode(null); }} disabled={!cityCode}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Kecamatan" />
            </SelectTrigger>
            <SelectContent>
              {districts?.map((d) => (
                <SelectItem key={d.code} value={d.code}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={scope} onValueChange={(v) => setScope(v as "district" | "village")}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="district">Semua desa/kelurahan di kecamatan ini</SelectItem>
              <SelectItem value="village">Desa/kelurahan tertentu saja</SelectItem>
            </SelectContent>
          </Select>

          {scope === "village" && (
            <Select value={villageCode ?? ""} onValueChange={setVillageCode} disabled={!districtCode}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Desa/Kelurahan" />
              </SelectTrigger>
              <SelectContent>
                {villages?.map((v) => (
                  <SelectItem key={v.code} value={v.code}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Input type="number" min={0} placeholder="Tarif (Rp)" value={fee} onChange={(e) => setFee(e.target.value)} />
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !districtCode || !fee || (scope === "village" && !villageCode)}
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RateRowManager({ rows, isLoading, exportUrl, onCreateRow, onDeleteRow, onImport, extraAction }: RateRowManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setImporting(true);
    try {
      const result = await onImport(file);
      if (result.skipped.length > 0) {
        toast.warning(`${result.imported} baris berhasil diimpor, ${result.skipped.length} baris dilewati.`, {
          description: result.skipped.slice(0, 5).map((s) => `Baris ${s.row}: ${s.reason}`).join("\n"),
        });
      } else {
        toast.success(`${result.imported} baris berhasil diimpor.`);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setImporting(false);
    }
  }

  async function handleDelete(rowId: string) {
    try {
      await onDeleteRow(rowId);
      toast.success("Baris tarif dihapus.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  const columns: DataTableColumn<RateRow>[] = [
    {
      id: "region",
      header: "Wilayah",
      cell: (row) =>
        row.village_code
          ? `${row.village_name ?? row.village_code} (${row.district_name ?? row.district_code})`
          : `${row.district_name ?? row.district_code} (semua desa/kelurahan)`,
    },
    {
      id: "fee",
      header: "Tarif",
      cell: (row) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(row.fee),
    },
    {
      id: "actions",
      header: "",
      cell: (row) => (
        <Button type="button" size="icon-sm" variant="ghost" onClick={() => handleDelete(row.id)}>
          <Trash2 className="h-3.5 w-3.5 text-destructive" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Baris kecamatan berlaku untuk semua desa/kelurahan di dalamnya, kecuali ada baris khusus desa/kelurahan yang menimpanya.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {extraAction}
          <Button type="button" variant="outline" asChild>
            <a href={`${env.apiUrl}${exportUrl}`} target="_blank" rel="noreferrer">
              <Download />
              Ekspor CSV
            </a>
          </Button>
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={importing}>
            {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload />}
            Impor CSV
          </Button>
          <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFileSelected} />
          <AddRowDialog onCreateRow={onCreateRow} />
        </div>
      </div>

      <DataTable columns={columns} data={rows} getRowKey={(row) => row.id} isLoading={isLoading} emptyMessage="Belum ada tarif." />
    </div>
  );
}
