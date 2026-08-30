"use client";

import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GripVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BannerFormDialog } from "@/features/admin/banner-form-dialog";
import { adminService } from "@/services/admin.service";
import { ApiError } from "@/types/api";
import type { Banner } from "@/types/banner";

const BANNERS_QUERY_KEY = ["admin", "banners"];

function getErrorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
}

function BannerRow({ banner }: { banner: Banner }) {
  const queryClient = useQueryClient();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: banner.id });

  const toggleMutation = useMutation({
    mutationFn: (is_active: boolean) => adminService.updateBanner(banner.id, { name: banner.name, is_active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BANNERS_QUERY_KEY }),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: () => adminService.deleteBanner(banner.id),
    onSuccess: () => {
      toast.success("Banner berhasil dihapus.");
      queryClient.invalidateQueries({ queryKey: BANNERS_QUERY_KEY });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <TableRow
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
    >
      <TableCell className="w-10">
        <button
          type="button"
          className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>
      <TableCell className="w-32">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={banner.image_url} alt={banner.name} className="h-16 w-28 rounded-md border border-border object-cover" />
      </TableCell>
      <TableCell className="font-medium">{banner.name}</TableCell>
      <TableCell className="max-w-48">
        {banner.link_url ? (
          <a
            href={banner.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-sm text-primary hover:underline"
          >
            {banner.link_url}
          </a>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell>
        <Switch
          checked={banner.is_active}
          onCheckedChange={(checked) => toggleMutation.mutate(checked)}
          disabled={toggleMutation.isPending}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <BannerFormDialog banner={banner} />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" size="icon-sm" variant="ghost">
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus banner &ldquo;{banner.name}&rdquo;?</AlertDialogTitle>
                <AlertDialogDescription>
                  Banner yang dihapus tidak akan tampil lagi di halaman utama marketplace.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function BannerList({ banners, isLoading }: { banners: Banner[]; isLoading?: boolean }) {
  const queryClient = useQueryClient();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const reorderMutation = useMutation({
    mutationFn: (ids: string[]) => adminService.reorderBanners(ids),
    onError: (error) => {
      toast.error(getErrorMessage(error));
      queryClient.invalidateQueries({ queryKey: BANNERS_QUERY_KEY });
    },
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = banners.findIndex((banner) => banner.id === active.id);
    const newIndex = banners.findIndex((banner) => banner.id === over.id);
    const reordered = arrayMove(banners, oldIndex, newIndex);

    queryClient.setQueryData<Banner[]>(BANNERS_QUERY_KEY, reordered);
    reorderMutation.mutate(reordered.map((banner) => banner.id));
  }

  const body = (
    <TableBody>
      {isLoading &&
        Array.from({ length: 3 }).map((_, index) => (
          <TableRow key={`skeleton-${index}`}>
            <TableCell colSpan={6}>
              <Skeleton className="h-12 w-full" />
            </TableCell>
          </TableRow>
        ))}

      {!isLoading && banners.length === 0 && (
        <TableRow>
          <TableCell colSpan={6} className="h-32 text-center text-sm text-muted-foreground">
            Belum ada banner.
          </TableCell>
        </TableRow>
      )}

      {!isLoading &&
        banners.length > 0 &&
        banners.map((banner) => <BannerRow key={banner.id} banner={banner} />)}
    </TableBody>
  );

  const table = (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10" />
          <TableHead>Gambar</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>Link</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>

      {!isLoading && banners.length > 0 ? (
        <SortableContext items={banners.map((banner) => banner.id)} strategy={verticalListSortingStrategy}>
          {body}
        </SortableContext>
      ) : (
        body
      )}
    </Table>
  );

  return (
    <div className="rounded-xl border border-border">
      {!isLoading && banners.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          {table}
        </DndContext>
      ) : (
        table
      )}
    </div>
  );
}
