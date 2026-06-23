"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { DealsDataTable } from "@/components/deals-data-table";
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
  DEAL_PAGE_SIZES,
  parseDealPageLimit,
} from "@/lib/deals-pagination";
import {
  buildDealsPath,
  parsePhoneFilterFromUrl,
} from "@/lib/deals-filter-params";
import { clampPage, getTotalPages } from "@/lib/messages-pagination";
import { createWassengerClient } from "@/lib/wassenger-axios";
import type { DealIntent, DealsPage } from "@/types/wassenger";

const DEAL_INTENTS = ["buy", "sell", "unknown"] as const;

function parseIntentFromUrl(raw: string | null): string {
  if (raw == null || raw === "") return "";
  const t = raw.trim().toLowerCase();
  return (DEAL_INTENTS as readonly string[]).includes(t) ? t : "";
}

export function DealsScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const api = useMemo(() => createWassengerClient(), []);

  const rawPage = Number(searchParams.get("page") ?? "1");
  const pageFromUrl = clampPage(
    Number.isFinite(rawPage) ? Math.floor(rawPage) : 1,
    Number.MAX_SAFE_INTEGER,
  );
  const limitFromUrl = parseDealPageLimit(searchParams.get("limit"));
  const rawPhoneFromUrl = searchParams.get("phone") ?? "";
  const phoneFromUrl = parsePhoneFilterFromUrl(rawPhoneFromUrl);
  const refFromUrl = searchParams.get("ref") ?? "";
  const intentFromUrl = parseIntentFromUrl(searchParams.get("intent"));

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
        buildDealsPath({
          page: 1,
          limit: limitFromUrl,
          phone: value.trim(),
          ref: refFromUrl,
          intent: intentFromUrl,
        }),
      );
    }, 350);
  }

  function onRefChange(value: string) {
    setRefInput(value);
    if (refDebounceRef.current) clearTimeout(refDebounceRef.current);
    refDebounceRef.current = setTimeout(() => {
      router.replace(
        buildDealsPath({
          page: 1,
          limit: limitFromUrl,
          phone: phoneFromUrl,
          ref: value.trim(),
          intent: intentFromUrl,
        }),
      );
    }, 350);
  }

  const query = useQuery({
    queryKey: [
      "deals",
      pageFromUrl,
      limitFromUrl,
      phoneFromUrl,
      refFromUrl,
      intentFromUrl,
    ],
    queryFn: async () => {
      const res = await api.get<DealsPage>("/deals", {
        params: {
          page: pageFromUrl,
          limit: limitFromUrl,
          ...(phoneFromUrl ? { phone: phoneFromUrl } : {}),
          ...(refFromUrl ? { ref: refFromUrl } : {}),
          ...(intentFromUrl ? { intent: intentFromUrl } : {}),
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
      buildDealsPath({
        page: pageFromUrl,
        limit: limitFromUrl,
        phone: phoneFromUrl,
        ref: refFromUrl,
        intent: intentFromUrl,
      }),
    );
  }, [
    intentFromUrl,
    limitFromUrl,
    pageFromUrl,
    phoneFromUrl,
    rawPhoneFromUrl,
    refFromUrl,
    router,
  ]);

  useEffect(() => {
    if (!data) return;
    if (safePage !== pageFromUrl) {
      router.replace(
        buildDealsPath({
          page: safePage,
          limit: limitFromUrl,
          phone: phoneFromUrl,
          ref: refFromUrl,
          intent: intentFromUrl,
        }),
      );
    }
  }, [
    data,
    intentFromUrl,
    limitFromUrl,
    pageFromUrl,
    phoneFromUrl,
    refFromUrl,
    router,
    safePage,
  ]);

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
    return buildDealsPath({
      page: p,
      limit: limitFromUrl,
      phone: phoneFromUrl,
      ref: refFromUrl,
      intent: intentFromUrl,
    });
  }

  function onLimitChange(next: string) {
    router.replace(
      buildDealsPath({
        page: 1,
        limit: Number(next),
        phone: phoneFromUrl,
        ref: refFromUrl,
        intent: intentFromUrl,
      }),
    );
  }

  function onIntentChange(value: string) {
    const nextIntent =
      value === "__all__" ? "" : (value as DealIntent);
    router.replace(
      buildDealsPath({
        page: 1,
        limit: limitFromUrl,
        phone: phoneFromUrl,
        ref: refFromUrl,
        intent: nextIntent,
      }),
    );
  }

  const intentSelectValue = intentFromUrl || "__all__";

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-[min(100%,2200px)] flex-1 flex-col gap-4 overflow-hidden p-4 md:p-6">
      <header className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="messages-heading text-xl font-semibold tracking-tight">
            Deals
          </h1>
          <p className="text-muted-foreground text-sm">
            {data
              ? `${data.total.toLocaleString()} total · page ${safePage} of ${totalPages}`
              : "Loading…"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild type="button" variant="default">
            <Link href={`/messages?page=1&limit=${encodeURIComponent(String(limitFromUrl))}`}>
              Messages
            </Link>
          </Button>
          <Button asChild type="button" variant="outline">
            <Link
              href={`/messages/cleaned?page=1&limit=${encodeURIComponent(String(limitFromUrl))}`}
            >
              Cleaned messages
            </Link>
          </Button>
          <Button asChild type="button" variant="outline">
            <Link href="/users?page=1&limit=20">Users</Link>
          </Button>
          <Button asChild type="button" variant="outline">
            <Link href="/groups?page=1&limit=20">Groups</Link>
          </Button>
          <Button
            disabled={logoutBusy}
            onClick={onLogout}
            type="button"
            variant="destructive"
          >
            {logoutBusy ? "Signing out…" : "Log out"}
          </Button>
        </div>
      </header>

      {query.isError ? (
        <div className="shrink-0 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
          <p className="font-medium">Could not load deals</p>
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
        <p className="text-muted-foreground shrink-0 text-sm">Loading deals…</p>
      ) : null}

      {data && !query.isLoading ? (
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <div className="flex flex-col gap-1.5">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                Phone
              </span>
              <input
                className="h-8 w-56 rounded-md border border-input bg-background px-3 text-sm shadow-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
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
                className="h-8 w-56 rounded-md border border-input bg-background px-3 text-sm shadow-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="126610LN"
                type="search"
                value={refInput}
                onChange={(e) => onRefChange(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                Intent
              </span>
              <Select value={intentSelectValue} onValueChange={onIntentChange}>
                <SelectTrigger size="sm" className="w-44">
                  <SelectValue placeholder="All intents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All intents</SelectItem>
                  {DEAL_INTENTS.map((i) => (
                    <SelectItem key={i} value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DealsDataTable data={data.data} />
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
