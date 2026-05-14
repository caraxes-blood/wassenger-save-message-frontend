import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** API-style keys (snake_case / camelCase) → spaced UPPERCASE for table headers. */
export function formatTableHeaderLabel(raw: string): string {
  const spacedUnderscore = raw.replace(/_/g, " ");
  const spacedCamel = spacedUnderscore.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return spacedCamel.replace(/\s+/g, " ").trim().toUpperCase();
}
