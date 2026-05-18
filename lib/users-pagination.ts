export const USER_PAGE_SIZES = [20, 50, 100] as const;

export type UserPageSize = (typeof USER_PAGE_SIZES)[number];

export function parseUserPageLimit(raw: string | null): UserPageSize {
  if (raw === null || raw === "") return 20;
  const n = Number(raw);
  if (!Number.isFinite(n)) return 20;
  if ((USER_PAGE_SIZES as readonly number[]).includes(n)) return n as UserPageSize;
  return 20;
}
