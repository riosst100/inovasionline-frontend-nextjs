import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaginatedMeta } from "@/types/admin";

interface DataTablePaginationProps {
  meta: PaginatedMeta;
  onPageChange: (page: number) => void;
}

export function DataTablePagination({ meta, onPageChange }: DataTablePaginationProps) {
  return (
    <div className="flex items-center justify-between gap-3 px-1">
      <p className="text-sm text-muted-foreground">
        Halaman {meta.current_page} dari {meta.last_page} &middot; {meta.total} total
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={meta.current_page <= 1}
          onClick={() => onPageChange(meta.current_page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Sebelumnya
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={meta.current_page >= meta.last_page}
          onClick={() => onPageChange(meta.current_page + 1)}
        >
          Berikutnya
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
