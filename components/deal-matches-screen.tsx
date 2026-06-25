"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { DealMatchesDataTable } from "@/components/deal-matches-data-table";
import { FiltersDropdown } from "@/components/filters-dropdown";
import { LogoutLink, NavLinks } from "@/components/nav-links";
import { PageNumberPagination } from "@/components/page-number-pagination";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  buildDealMatchesPath,
  parsePhoneFilterFromUrl,
} from "@/lib/deal-matches-filter-params";
import { DEAL_PAGE_SIZES, parseDealPageLimit } from "@/lib/deals-pagination";
import { clampPage, getTotalPages } from "@/lib/messages-pagination";
import { createWassengerClient } from "@/lib/wassenger-axios";
import type { DealMatchesPage } from "@/types/wassenger";

export function DealMatchesScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const api = useMemo(() => createWassengerClient(), []);

  const rawPage = Number(searchParams.get("page") ?? "1");
  const pageFromUrl = clampPage(
    Number.isFinite(rawPage) ? Math.floor(rawPage) : 1,
    Number.MAX_SAFE_INTEGER,
  );
  const limitFromUrl = parseDealPageLimit(searchParams.get("limit") ?? "100");
  const rawPhoneFromUrl = searchParams.get("phone") ?? "";
  const phoneFromUrl = parsePhoneFilterFromUrl(rawPhoneFromUrl);
  const refFromUrl = searchParams.get("ref") ?? "";

  const [phoneInput, setPhoneInput] = useState(phoneFromUrl);
  const [refInput, setRefInput] = useState(refFromUrl);
  const [prevPhoneFromUrl, setPrevPhoneFromUrl] = useState(phoneFromUrl);
  const [prevRefFromUrl, setPrevRefFromUrl] = useState(refFromUrl);
  const phoneDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [logoutBusy, setLogoutBusy] = useState(false);

  if (phoneFromUrl !== prevPhoneFromUrl) {
    setPrevPhoneFromUrl(phoneFromUrl);
    setPhoneInput(phoneFromUrl);
  }

  if (refFromUrl !== prevRefFromUrl) {
    setPrevRefFromUrl(refFromUrl);
    setRefInput(refFromUrl);
  }

  function onPhoneChange(value: string) {
    setPhoneInput(value);
    if (phoneDebounceRef.current) clearTimeout(phoneDebounceRef.current);
    phoneDebounceRef.current = setTimeout(() => {
      router.replace(
        buildDealMatchesPath({
          page: 1,
          limit: limitFromUrl,
          phone: value.trim(),
          ref: refFromUrl,
        }),
      );
    }, 350);
  }

  function onRefChange(value: string) {
    setRefInput(value);
    if (refDebounceRef.current) clearTimeout(refDebounceRef.current);
    refDebounceRef.current = setTimeout(() => {
      router.replace(
        buildDealMatchesPath({
          page: 1,
          limit: limitFromUrl,
          phone: phoneFromUrl,
          ref: value.trim(),
        }),
      );
    }, 350);
  }

  const query = useQuery({
    queryKey: ["deal-matches", pageFromUrl, limitFromUrl, phoneFromUrl, refFromUrl],
    queryFn: async () => {
      const res = await api.get<DealMatchesPage>("/deal-matches", {
        params: {
          page: pageFromUrl,
          limit: limitFromUrl,
          ...(phoneFromUrl ? { phone: phoneFromUrl } : {}),
          ...(refFromUrl ? { ref: refFromUrl } : {}),
        },
      });
      return res.data;
    },
  });

  const data = query.data;
  const totalPages = data ? getTotalPages(data.total, limitFromUrl) : 1;
  const safePage = clampPage(pageFromUrl, totalPages);

  useEffect(() => {
    if (!rawPhoneFromUrl || rawPhoneFromUrl === phoneFromUrl) return;
    router.replace(
      buildDealMatchesPath({
        page: pageFromUrl,
        limit: limitFromUrl,
        phone: phoneFromUrl,
        ref: refFromUrl,
      }),
    );
  }, [limitFromUrl, pageFromUrl, phoneFromUrl, rawPhoneFromUrl, refFromUrl, router]);

  useEffect(() => {
    if (!data) return;
    if (safePage !== pageFromUrl) {
      router.replace(
        buildDealMatchesPath({
          page: safePage,
          limit: limitFromUrl,
          phone: phoneFromUrl,
          ref: refFromUrl,
        }),
      );
    }
  }, [data, limitFromUrl, pageFromUrl, phoneFromUrl, refFromUrl, router, safePage]);

  async function onLogout() {
    setLogoutBusy(true);
    try {
      try {
        await api.post("/auth/logout");
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 405) {
          await api.get("/auth/logout");
        }
      }
    } finally {
      setLogoutBusy(false);
      router.replace("/login");
    }
  }

  function buildHref(p: number) {
    return buildDealMatchesPath({
      page: p,
      limit: limitFromUrl,
      phone: phoneFromUrl,
      ref: refFromUrl,
    });
  }

  function onLimitChange(next: string) {
    router.replace(
      buildDealMatchesPath({
        page: 1,
        limit: Number(next),
        phone: phoneFromUrl,
        ref: refFromUrl,
      }),
    );
  }

  const activeFilterCount = [phoneFromUrl, refFromUrl].filter(Boolean).length;

  function onClearFilters() {
    setPhoneInput("");
    setRefInput("");
    router.replace(buildDealMatchesPath({ page: 1, limit: limitFromUrl, phone: "", ref: "" }));
  }

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-[min(100%,2200px)] flex-1 flex-col gap-3 overflow-hidden p-4 md:p-6">
      <header className="flex shrink-0 flex-col gap-2 border-b border-border pb-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="messages-heading text-2xl font-semibold tracking-tight">
            Deal matches
          </h1>
          <p className="text-muted-foreground text-sm">
            {data
              ? `${data.total.toLocaleString()} total · page ${safePage} of ${totalPages}`
              : "Loading…"}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <NavLinks
            links={[
              { href: `/deals?page=1&limit=${encodeURIComponent(String(limitFromUrl))}`, label: "Deals" },
              { href: `/messages?page=1&limit=${encodeURIComponent(String(limitFromUrl))}`, label: "Messages" },
              { href: "/users?page=1&limit=20", label: "Users" },
              { href: "/groups?page=1&limit=20", label: "Groups" },
            ]}
          />
          <LogoutLink busy={logoutBusy} onClick={onLogout} />
        </div>
      </header>

      {query.isError ? (
        <div className="shrink-0 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
          <p className="font-medium">Could not load deal matches</p>
          <p className="text-muted-foreground mt-1">
            {query.error instanceof Error
              ? query.error.message
              : "Unknown error"}
          </p>
          <Button
            className="mt-3"
            onClick={() => query.refetch()}
            type="button"
            variant="secondary"
          >
            Retry
          </Button>
        </div>
      ) : null}

      {query.isLoading ? (
        <p className="text-muted-foreground shrink-0 text-sm">Loading deal matches…</p>
      ) : null}

      {data && !query.isLoading ? (
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
          <DealMatchesDataTable
            data={data.data}
            filters={
              <FiltersDropdown activeCount={activeFilterCount} onClear={onClearFilters}>
                <div className="flex flex-col gap-1.5">
                  <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                    Phone
                  </span>
                  <input
                    className="h-8 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder="+923001234567"
                    type="search"
                    value={phoneInput}
                    onChange={(e) => onPhoneChange(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                    Ref
                  </span>
                  <input
                    className="h-8 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder="126610LN"
                    type="search"
                    value={refInput}
                    onChange={(e) => onRefChange(e.target.value)}
                  />
                </div>
              </FiltersDropdown>
            }
          />
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="whitespace-nowrap">Rows per page</span>
              <Select value={String(limitFromUrl)} onValueChange={onLimitChange}>
                <SelectTrigger size="sm" className="w-18">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEAL_PAGE_SIZES.map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <PageNumberPagination
              buildHref={buildHref}
              hasNext={data.hasNext}
              hasPrev={data.hasPrev}
              page={safePage}
              totalPages={totalPages}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
