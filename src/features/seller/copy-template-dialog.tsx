"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAvailableRateTemplates, useCopyRateTemplate } from "@/features/seller/use-shipping-methods";
import { ApiError } from "@/types/api";

function getErrorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
}

export function CopyTemplateDialog({ shippingMethodId }: { shippingMethodId: string }) {
  const [open, setOpen] = useState(false);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const { data: templates } = useAvailableRateTemplates();
  const copyTemplate = useCopyRateTemplate(shippingMethodId);

  async function handleCopy() {
    if (!templateId) return;
    try {
      const result = await copyTemplate.mutateAsync(templateId);
      toast.success(`${result.copied} baris tarif berhasil disalin dari template.`);
      setOpen(false);
      setTemplateId(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          Salin dari Template
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Salin Tarif dari Template</DialogTitle>
          <DialogDescription>
            Baris tarif dari template akan disalin ke metode pengiriman ini. Baris yang sudah ada dengan wilayah yang sama akan ditimpa.
          </DialogDescription>
        </DialogHeader>

        {templates && templates.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada template tarif yang dibuat admin.</p>
        ) : (
          <Select value={templateId ?? ""} onValueChange={setTemplateId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih template" />
            </SelectTrigger>
            <SelectContent>
              {templates?.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name} {template.rows_count !== undefined ? `(${template.rows_count} baris)` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <DialogFooter>
          <Button type="button" onClick={handleCopy} disabled={!templateId || copyTemplate.isPending}>
            {copyTemplate.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Salin
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
