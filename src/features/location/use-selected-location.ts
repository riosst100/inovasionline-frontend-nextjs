"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { SelectedLocation } from "@/types/region";

const STORAGE_KEY = "selected-location";
const listeners = new Set<() => void>();

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notify(): void {
  listeners.forEach((listener) => listener());
}

function getSnapshot(): string | null {
  return window.localStorage.getItem(STORAGE_KEY);
}

function getServerSnapshot(): string | null {
  return null;
}

function parseLocation(raw: string | null): SelectedLocation | null {
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SelectedLocation;
  } catch {
    return null;
  }
}

export function useSelectedLocation() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const location = parseLocation(raw);

  const setLocation = useCallback((next: SelectedLocation) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    notify();
  }, []);

  const clearLocation = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    notify();
  }, []);

  return { location, setLocation, clearLocation };
}
