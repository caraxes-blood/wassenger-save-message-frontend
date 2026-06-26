export const DEAL_PAGE_SIZES = [20, 50, 100] as const;

export type DealPageSize = (typeof DEAL_PAGE_SIZES)[number];

export function parseDealPageLimit(raw: string | null): DealPageSize {
  if (raw === null || raw === "") return 100;
  const n = Number(raw);
  if (!Number.isFinite(n)) return 20;
  if ((DEAL_PAGE_SIZES as readonly number[]).includes(n)) {
    return n as DealPageSize;
  }
  return 20;
}
