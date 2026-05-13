export const messageDateFmt = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
  timeStyle: "short",
});

export function getPreview(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const root = payload as Record<string, unknown>;
  const data = root.data;
  if (!data || typeof data !== "object") return "";
  const d = data as Record<string, unknown>;
  if (typeof d.body === "string") return d.body;
  const media = d.media;
  if (media && typeof media === "object") {
    const cap = (media as Record<string, unknown>).caption;
    if (typeof cap === "string") return cap;
  }
  return "";
}

export function getMessageType(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const root = payload as Record<string, unknown>;
  const data = root.data;
  if (!data || typeof data !== "object") return "";
  const t = (data as Record<string, unknown>).type;
  return typeof t === "string" ? t : "";
}

export function truncateMessagePreview(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max)}…`;
}
