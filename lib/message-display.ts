import { getWassengerBaseUrl } from "./wassenger-env";

export const messageDateFmt = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
  timeStyle: "short",
});

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
