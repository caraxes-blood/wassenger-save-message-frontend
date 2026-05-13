export const MESSAGE_PAGE_SIZES = [10, 25, 50, 100] as const;

export type MessagePageSize = (typeof MESSAGE_PAGE_SIZES)[number];

export function parseMessagePageLimit(raw: string | null): MessagePageSize {
  if (raw === null || raw === "") return 100;
  const n = Number(raw);
  if (!Number.isFinite(n)) return 100;
  if ((MESSAGE_PAGE_SIZES as readonly number[]).includes(n)) {
    return n as MessagePageSize;
  }
  return 100;
}

export function getTotalPages(total: number, limit: number): number {
  if (!Number.isFinite(total) || total <= 0) return 1;
  if (!Number.isFinite(limit) || limit <= 0) return 1;
  return Math.max(1, Math.ceil(total / limit));
}

export function clampPage(page: number, totalPages: number): number {
  const tp = Math.max(1, totalPages);
  if (!Number.isFinite(page)) return 1;
  return Math.min(Math.max(1, Math.floor(page)), tp);
}
