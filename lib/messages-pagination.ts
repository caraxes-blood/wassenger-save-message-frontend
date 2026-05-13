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
