"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { MessagesTable } from "@/components/messages-table";
import { PageNumberPagination } from "@/components/page-number-pagination";
import { Button } from "@/components/ui/button";
import { clampPage, getTotalPages } from "@/lib/messages-pagination";
import { createWassengerClient } from "@/lib/wassenger-axios";
import type { MessagesPage } from "@/types/wassenger";

const DEFAULT_LIMIT = 100;

export function MessagesScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const api = useMemo(() => createWassengerClient(), []);

  const raw = Number(searchParams.get("page") ?? "1");
  const pageFromUrl = clampPage(
    Number.isFinite(raw) ? Math.floor(raw) : 1,
    Number.MAX_SAFE_INTEGER,
  );

  const [logoutBusy, setLogoutBusy] = useState(false);

  const query = useQuery({
    queryKey: ["messages", pageFromUrl, DEFAULT_LIMIT],
    queryFn: async () => {
      const res = await api.get<MessagesPage>("/messages", {
        params: { page: pageFromUrl, limit: DEFAULT_LIMIT },
      });
      return res.data;
    },
  });

  const data = query.data;
  const totalPages = data
    ? getTotalPages(data.total, DEFAULT_LIMIT)
    : 1;
  const safePage = clampPage(pageFromUrl, totalPages);

  useEffect(() => {
    if (!data) return;
    if (safePage !== pageFromUrl) {
      router.replace(`/messages?page=${safePage}`);
    }
  }, [data, pageFromUrl, router, safePage]);

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

  const buildHref = (p: number) => `/messages?page=${p}`;

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-4 p-4 md:p-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Messages</h1>
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
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
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
        <p className="text-muted-foreground text-sm">Loading messages…</p>
      ) : null}

      {data && !query.isLoading ? (
        <>
          <MessagesTable rows={data.data} />
          <PageNumberPagination
            buildHref={buildHref}
            hasNext={data.hasNext}
            hasPrev={data.hasPrev}
            page={safePage}
            totalPages={totalPages}
          />
        </>
      ) : null}
    </div>
  );
}
