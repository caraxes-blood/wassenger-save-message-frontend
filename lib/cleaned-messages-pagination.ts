/** Matches GET /cleaned-messages: default limit 20, max 100 */
export const CLEANED_MESSAGE_PAGE_SIZES = [20, 50, 100] as const;

export type CleanedMessagePageSize =
  (typeof CLEANED_MESSAGE_PAGE_SIZES)[number];

export function parseCleanedMessagePageLimit(
  raw: string | null,
): CleanedMessagePageSize {
  if (raw === null || raw === "") return 20;
  const n = Number(raw);
  if (!Number.isFinite(n)) return 20;
  if ((CLEANED_MESSAGE_PAGE_SIZES as readonly number[]).includes(n)) {
    return n as CleanedMessagePageSize;
  }
  return 20;
}
