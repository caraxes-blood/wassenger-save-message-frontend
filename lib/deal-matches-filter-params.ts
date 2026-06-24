import { parsePhoneFilterFromUrl } from "@/lib/deals-filter-params";

export { parsePhoneFilterFromUrl };

export function buildDealMatchesPath(opts: {
  page: number;
  limit: number;
  phone: string;
  ref: string;
}): string {
  const params = new URLSearchParams();
  params.set("page", String(opts.page));
  params.set("limit", String(opts.limit));
  if (opts.phone) params.set("phone", opts.phone);
  if (opts.ref) params.set("ref", opts.ref);
  return `/deal-matches?${params.toString()}`;
}
