import { getWassengerBaseUrl } from "./wassenger-env";
import { format, parseISO } from "date-fns";

export const messageDateFmt = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
  timeStyle: "short",
});

export function formatReadableMessageDate(value: string | Date): string | null {
  const parsed = value instanceof Date ? value : parseISO(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return format(parsed, "d MMMM yyyy 'at' h:mm aaa");
}

export function resolveMessageImageUrl(
  path: string | null | undefined,
): string | null {
  const p = typeof path === "string" ? path.trim() : "";
  if (!p) return null;
  if (p.startsWith("http://") || p.startsWith("https://")) return p;
  return `${getWassengerBaseUrl()}${p.startsWith("/") ? p : `/${p}`}`;
}

export function truncateMessagePreview(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max)}…`;
}
