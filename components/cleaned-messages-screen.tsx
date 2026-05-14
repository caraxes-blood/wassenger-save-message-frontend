"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { CleanedMessagesDataTable } from "@/components/cleaned-messages-data-table";
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
  CLEANED_MESSAGE_PAGE_SIZES,
  parseCleanedMessagePageLimit,
} from "@/lib/cleaned-messages-pagination";
import { clampPage } from "@/lib/messages-pagination";
import { createWassengerClient } from "@/lib/wassenger-axios";
import type { CleanedMessagesPage } from "@/types/wassenger";

const CLEANED_INTENTS = ["buy", "sell", "inquiry", "other"] as const;
type CleanedIntent = (typeof CLEANED_INTENTS)[number];

function parseIntentFromUrl(raw: string | null): string {
  if (raw == null || raw === "") return "";
  const t = raw.trim().toLowerCase();
  return (CLEANED_INTENTS as readonly string[]).includes(t) ? t : "";
}

/** URL + filter state: omit = all; only "true" | "false" sent to API */
function parseIsSystemFromUrl(raw: string | null): "" | "true" | "false" {
  if (raw === "true" || raw === "false") return raw;
  return "";
}

function buildCleanedMessagesPath(opts: {
  page: number;
  limit: number;
  intent: string;
  isSystem: "" | "true" | "false";
}): string {
  const params = new URLSearchParams();
  params.set("page", String(opts.page));
  params.set("limit", String(opts.limit));
  if (opts.intent) params.set("intent", opts.intent);
  if (opts.isSystem === "true" || opts.isSystem === "false") {
    params.set("is_system", opts.isSystem);
  }
  return `/messages/cleaned?${params.toString()}`;
}

export function CleanedMessagesScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const api = useMemo(() => createWassengerClient(), []);

  const rawPage = Number(searchParams.get("page") ?? "1");
  const pageFromUrl = clampPage(
    Number.isFinite(rawPage) ? Math.floor(rawPage) : 1,
    Number.MAX_SAFE_INTEGER,
  );

  const limitFromUrl = parseCleanedMessagePageLimit(searchParams.get("limit"));

  const intentFromUrl = parseIntentFromUrl(searchParams.get("intent"));
  const isSystemFromUrl = parseIsSystemFromUrl(searchParams.get("is_system"));

  const [logoutBusy, setLogoutBusy] = useState(false);

  const query = useQuery({
    queryKey: [
      "cleaned-messages",
      pageFromUrl,
      limitFromUrl,
      intentFromUrl,
      isSystemFromUrl,
    ],
    queryFn: async () => {
      const res = await api.get<CleanedMessagesPage>("/cleaned-messages", {
        params: {
          page: pageFromUrl,
          limit: limitFromUrl,
          ...(intentFromUrl ? { intent: intentFromUrl } : {}),
          ...(isSystemFromUrl === "true" || isSystemFromUrl === "false"
            ? { is_system: isSystemFromUrl }
            : {}),
        },
      });
      return res.data;
    },
  });

  const data = query.data;
  const totalPages = data ? Math.max(1, data.totalPages) : 1;
  const safePage = clampPage(pageFromUrl, totalPages);

  useEffect(() => {
    if (!data) return;
    if (safePage !== pageFromUrl) {
      router.replace(
        buildCleanedMessagesPath({
          page: safePage,
          limit: limitFromUrl,
          intent: intentFromUrl,
          isSystem: isSystemFromUrl,
        }),
      );
    }
  }, [
    data,
    intentFromUrl,
    isSystemFromUrl,
    limitFromUrl,
    pageFromUrl,
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
    return buildCleanedMessagesPath({
      page: p,
      limit: limitFromUrl,
      intent: intentFromUrl,
      isSystem: isSystemFromUrl,
    });
  }

  function onLimitChange(next: string) {
    router.replace(
      buildCleanedMessagesPath({
        page: 1,
        limit: Number(next),
        intent: intentFromUrl,
        isSystem: isSystemFromUrl,
      }),
    );
  }

  function onIntentChange(value: string) {
    const nextIntent =
      value === "__all__" ? "" : (value as CleanedIntent);
    router.replace(
      buildCleanedMessagesPath({
        page: 1,
        limit: limitFromUrl,
        intent: nextIntent,
        isSystem: isSystemFromUrl,
      }),
    );
  }

  function onIsSystemChange(value: string) {
    const next: "" | "true" | "false" =
      value === "__all__" ? "" : value === "true" ? "true" : "false";
    router.replace(
      buildCleanedMessagesPath({
        page: 1,
        limit: limitFromUrl,
        intent: intentFromUrl,
        isSystem: next,
      }),
    );
  }

  const intentSelectValue = intentFromUrl || "__all__";
  const isSystemSelectValue =
    isSystemFromUrl === "" ? "__all__" : isSystemFromUrl;

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-[min(100%,2200px)] flex-1 flex-col gap-4 overflow-hidden p-4 md:p-6">
      <header className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="messages-heading text-xl font-semibold tracking-tight">
            Cleaned messages
          </h1>
          <p className="text-muted-foreground text-sm">
            {data
              ? `${data.total.toLocaleString()} total · page ${safePage} of ${totalPages}`
              : "Loading…"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild type="button" variant="default">
            <Link
              href={`/messages?page=1&limit=${encodeURIComponent(String(limitFromUrl))}`}
            >
              Back to messages
            </Link>
          </Button>
          <Button asChild type="button" variant="outline">
            <Link
              href={`/messages/failed?page=1&limit=${encodeURIComponent(String(limitFromUrl))}`}
            >
              View failed messages
            </Link>
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
          <p className="font-medium">Could not load cleaned messages</p>
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
        <p className="text-muted-foreground shrink-0 text-sm">
          Loading cleaned messages…
        </p>
      ) : null}

      {data && !query.isLoading ? (
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
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
                  {CLEANED_INTENTS.map((i) => (
                    <SelectItem key={i} value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                System messages
              </span>
              <Select value={isSystemSelectValue} onValueChange={onIsSystemChange}>
                <SelectTrigger size="sm" className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All</SelectItem>
                  <SelectItem value="false">Human only</SelectItem>
                  <SelectItem value="true">System only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <CleanedMessagesDataTable data={data.data} />
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="whitespace-nowrap">Rows per page</span>
              <Select value={String(limitFromUrl)} onValueChange={onLimitChange}>
                <SelectTrigger size="sm" className="w-18">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLEANED_MESSAGE_PAGE_SIZES.map((n) => (
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
