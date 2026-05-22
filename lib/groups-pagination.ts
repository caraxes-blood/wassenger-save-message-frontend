export const GROUP_PAGE_SIZES = [20, 50, 100] as const;

export type GroupPageSize = (typeof GROUP_PAGE_SIZES)[number];

export function parseGroupPageLimit(raw: string | null): GroupPageSize {
  if (raw === null || raw === "") return 20;
  const n = Number(raw);
  if (!Number.isFinite(n)) return 20;
  if ((GROUP_PAGE_SIZES as readonly number[]).includes(n)) return n as GroupPageSize;
  return 20;
}
