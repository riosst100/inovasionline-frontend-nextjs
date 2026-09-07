"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ImagePlus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ExistingProductImage {
  id: string;
  url: string;
}

interface ExistingItem extends ExistingProductImage {
  kind: "existing";
}

interface NewItem {
  kind: "new";
  id: string;
  file: File;
}

type ImageItem = ExistingItem | NewItem;

interface ProductImageInputProps {
  value: File[];
  onChange: (files: File[]) => void;
  existingImages?: ExistingProductImage[];
  existingImageOrder?: string[];
  onExistingImageOrderChange?: (ids: string[]) => void;
  maxFiles?: number;
}

let newImageSeq = 0;

export function ProductImageInput({
  value,
  onChange,
  existingImages = [],
  existingImageOrder,
  onExistingImageOrderChange,
  maxFiles = 8,
}: ProductImageInputProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const [newImageKeys] = useState(() => new Map<File, string>());

  function keyFor(file: File): string {
    let key = newImageKeys.get(file);
    if (!key) {
      key = `new-${++newImageSeq}`;
      newImageKeys.set(file, key);
    }
    return key;
  }

  const existingById = useMemo(() => {
    const map = new Map<string, ExistingProductImage>();
    existingImages.forEach((image) => map.set(image.id, image));
    return map;
  }, [existingImages]);

  const order = existingImageOrder ?? existingImages.map((image) => image.id);

  const items: ImageItem[] = useMemo(() => {
    const existing: ImageItem[] = order
      .filter((id) => existingById.has(id))
      .map((id) => ({ kind: "existing", ...existingById.get(id)! }));
    const fresh: ImageItem[] = value.map((file) => ({ kind: "new", id: keyFor(file), file }));
    return [...existing, ...fresh];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, existingById, value]);

  const previewUrls = useMemo(() => {
    const map = new Map<string, string>();
    items.forEach((item) => {
      if (item.kind === "new") map.set(item.id, URL.createObjectURL(item.file));
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [previewUrls]);

  function commit(nextItems: ImageItem[]) {
    const nextExisting = nextItems.filter((item): item is ExistingItem => item.kind === "existing").map((item) => item.id);
    const nextFiles = nextItems.filter((item): item is NewItem => item.kind === "new").map((item) => item.file);
    onExistingImageOrderChange?.(nextExisting);
    onChange(nextFiles);
  }

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    commit([...items, ...files.map((file) => ({ kind: "new" as const, id: keyFor(file), file }))].slice(0, maxFiles));
    e.target.value = "";
  }

  function handleRemove(id: string) {
    commit(items.filter((item) => item.id !== id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    commit(arrayMove(items, oldIndex, newIndex));
  }

  return (
    <div className="space-y-2">
      {items.length > 1 && <p className="text-xs text-muted-foreground">Geser untuk ubah posisi.</p>}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {items.map((item, index) => (
              <ImageTile
                key={item.id}
                id={item.id}
                isPrimary={index === 0}
                url={item.kind === "existing" ? item.url : (previewUrls.get(item.id) ?? "")}
                onRemove={() => handleRemove(item.id)}
              />
            ))}

            {items.length < maxFiles && (
              <label
                className={cn(
                  "flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:bg-muted/50"
                )}
              >
                <ImagePlus className="h-5 w-5" />
                <span className="text-[11px]">Tambah</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleSelect} />
              </label>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function ImageTile({
  id,
  url,
  isPrimary,
  onRemove,
}: {
  id: string;
  url: string;
  isPrimary: boolean;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="group relative aspect-square overflow-hidden rounded-lg border border-border"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="" className="h-full w-full object-cover" />

      {isPrimary && (
        <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
          Utama
        </span>
      )}

      <button
        type="button"
        onClick={onRemove}
        className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 transition-opacity group-hover:opacity-100"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute inset-x-0 bottom-0 flex h-8 cursor-grab touch-none items-center justify-center bg-background/90 text-foreground opacity-0 transition-opacity active:cursor-grabbing group-hover:opacity-100"
      >
        <GripVertical className="h-5 w-5" />
      </button>
    </div>
  );
}
