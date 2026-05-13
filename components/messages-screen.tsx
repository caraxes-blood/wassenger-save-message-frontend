"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { MessagesDataTable } from "@/components/messages-data-table";
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
  MESSAGE_PAGE_SIZES,
  clampPage,
  getTotalPages,
  parseMessagePageLimit,
} from "@/lib/messages-pagination";
import { createWassengerClient } from "@/lib/wassenger-axios";
import type { MessagesPage } from "@/types/wassenger";

export function MessagesScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const api = useMemo(() => createWassengerClient(), []);

  const rawPage = Number(searchParams.get("page") ?? "1");
  const pageFromUrl = clampPage(
    Number.isFinite(rawPage) ? Math.floor(rawPage) : 1,
    Number.MAX_SAFE_INTEGER,
  );

  const limitFromUrl = parseMessagePageLimit(searchParams.get("limit"));

  const [logoutBusy, setLogoutBusy] = useState(false);

  const query = useQuery({
    queryKey: ["messages", pageFromUrl, limitFromUrl],
    queryFn: async () => {
      const res = await api.get<MessagesPage>("/messages", {
        params: { page: pageFromUrl, limit: limitFromUrl },
      });
      return res.data;
    },
  });

  const data = query.data;
  const totalPages = data ? getTotalPages(data.total, limitFromUrl) : 1;
  const safePage = clampPage(pageFromUrl, totalPages);

  useEffect(() => {
    if (!data) return;
    if (safePage !== pageFromUrl) {
      const params = new URLSearchParams();
      params.set("page", String(safePage));
      params.set("limit", String(limitFromUrl));
      router.replace(`/messages?${params.toString()}`);
    }
  }, [data, pageFromUrl, router, safePage, limitFromUrl]);

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
    const params = new URLSearchParams();
    params.set("page", String(p));
    params.set("limit", String(limitFromUrl));
    return `/messages?${params.toString()}`;
  }

  function onLimitChange(next: string) {
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", next);
    router.replace(`/messages?${params.toString()}`);
  }

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 flex-col gap-4 overflow-hidden p-4 md:p-6">
      <header className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="messages-heading text-xl font-semibold tracking-tight">
            Messages
          </h1>
          <p className="text-muted-foreground text-sm">
            {data
              ? `${data.total.toLocaleString()} total · page ${safePage} of ${totalPages}`
              : "Loading…"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            disabled={logoutBusy}
            onClick={onLogout}
            type="button"
            variant="outline"
          >
            {logoutBusy ? "Signing out…" : "Log out"}
          </Button>
        </div>
      </header>

      {query.isError ? (
        <div className="shrink-0 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
          <p className="font-medium">Could not load messages</p>
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
        <p className="text-muted-foreground shrink-0 text-sm">Loading messages…</p>
      ) : null}

      {data && !query.isLoading ? (
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
          <MessagesDataTable data={data.data} />
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="whitespace-nowrap">Rows per page</span>
              <Select value={String(limitFromUrl)} onValueChange={onLimitChange}>
                <SelectTrigger size="sm" className="w-[4.5rem]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MESSAGE_PAGE_SIZES.map((n) => (
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
