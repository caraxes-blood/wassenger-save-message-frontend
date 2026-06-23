/**
 * Phone numbers in query strings use application/x-www-form-urlencoded rules:
 * a literal `+` is decoded as a space. Normalize on read; URLSearchParams encodes on write.
 */
export function parsePhoneFilterFromUrl(raw: string | null): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (raw.startsWith(" ")) {
    return `+${trimmed}`;
  }
  return raw;
}

export function buildDealsPath(opts: {
  page: number;
  limit: number;
  phone: string;
  ref: string;
  intent: string;
}): string {
  const params = new URLSearchParams();
  params.set("page", String(opts.page));
  params.set("limit", String(opts.limit));
  if (opts.phone) params.set("phone", opts.phone);
  if (opts.ref) params.set("ref", opts.ref);
  if (opts.intent) params.set("intent", opts.intent);
  return `/deals?${params.toString()}`;
}
