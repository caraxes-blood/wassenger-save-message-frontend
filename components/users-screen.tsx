"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { PageNumberPagination } from "@/components/page-number-pagination";
import { UsersDataTable } from "@/components/users-data-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { clampPage } from "@/lib/messages-pagination";
import { USER_PAGE_SIZES, parseUserPageLimit } from "@/lib/users-pagination";
import { createWassengerClient } from "@/lib/wassenger-axios";
import type { GroupsResponse, UsersPage } from "@/types/wassenger";

function buildUsersPath(opts: {
  page: number;
  limit: number;
  q: string;
  groupWid: string;
}): string {
  const params = new URLSearchParams();
  params.set("page", String(opts.page));
  params.set("limit", String(opts.limit));
  if (opts.q) params.set("q", opts.q);
  if (opts.groupWid) params.set("group_wid", opts.groupWid);
  return `/users?${params.toString()}`;
}

export function UsersScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const api = useMemo(() => createWassengerClient(), []);

  const rawPage = Number(searchParams.get("page") ?? "1");
  const pageFromUrl = clampPage(
    Number.isFinite(rawPage) ? Math.floor(rawPage) : 1,
    Number.MAX_SAFE_INTEGER,
  );
  const limitFromUrl = parseUserPageLimit(searchParams.get("limit"));
  const qFromUrl = searchParams.get("q") ?? "";
  const groupWidFromUrl = searchParams.get("group_wid") ?? "";

  // Local search input — debounced 350ms before pushing to URL
  const [searchInput, setSearchInput] = useState(qFromUrl);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep local input in sync if URL changes externally (e.g. browser back)
  useEffect(() => {
    setSearchInput(qFromUrl);
  }, [qFromUrl]);

  function onSearchChange(value: string) {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      router.replace(
        buildUsersPath({
          page: 1,
          limit: limitFromUrl,
          q: value.trim(),
          groupWid: groupWidFromUrl,
        }),
      );
    }, 350);
  }

  const groupsQuery = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const res = await api.get<GroupsResponse>("/groups");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const usersQuery = useQuery({
    queryKey: ["users", pageFromUrl, limitFromUrl, qFromUrl, groupWidFromUrl],
    queryFn: async () => {
      const res = await api.get<UsersPage>("/users", {
        params: {
          page: pageFromUrl,
          limit: limitFromUrl,
          ...(qFromUrl ? { q: qFromUrl } : {}),
          ...(groupWidFromUrl ? { group_wid: groupWidFromUrl } : {}),
        },
      });
      return res.data;
    },
  });

  const data = usersQuery.data;
  const totalPages = data ? Math.max(1, data.totalPages) : 1;
  const safePage = clampPage(pageFromUrl, totalPages);

  useEffect(() => {
    if (!data) return;
    if (safePage !== pageFromUrl) {
      router.replace(
        buildUsersPath({
          page: safePage,
          limit: limitFromUrl,
          q: qFromUrl,
          groupWid: groupWidFromUrl,
        }),
      );
    }
  }, [data, groupWidFromUrl, limitFromUrl, pageFromUrl, qFromUrl, router, safePage]);

  function buildHref(p: number) {
    return buildUsersPath({ page: p, limit: limitFromUrl, q: qFromUrl, groupWid: groupWidFromUrl });
  }

  function onLimitChange(next: string) {
    router.replace(
      buildUsersPath({ page: 1, limit: Number(next), q: qFromUrl, groupWid: groupWidFromUrl }),
    );
  }

  function onGroupChange(value: string) {
    router.replace(
      buildUsersPath({
        page: 1,
        limit: limitFromUrl,
        q: qFromUrl,
        groupWid: value === "__all__" ? "" : value,
      }),
    );
  }

  const groupSelectValue = groupWidFromUrl || "__all__";

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-[min(100%,2200px)] flex-1 flex-col gap-4 overflow-hidden p-4 md:p-6">
      <header className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="messages-heading text-xl font-semibold tracking-tight">
            Users
          </h1>
          <p className="text-muted-foreground text-sm">
            {data
              ? `${data.total.toLocaleString()} total · page ${safePage} of ${totalPages}`
              : "Loading…"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild type="button" variant="default">
            <Link href="/messages?page=1&limit=20">Messages</Link>
          </Button>
          <Button asChild type="button" variant="outline">
            <Link href="/messages/cleaned?page=1&limit=20">Cleaned messages</Link>
          </Button>
          <Button asChild type="button" variant="outline">
            <Link href="/groups?page=1&limit=20">Groups</Link>
          </Button>
        </div>
      </header>

      {usersQuery.isError ? (
        <div className="shrink-0 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
          <p className="font-medium">Could not load users</p>
          <p className="text-muted-foreground mt-1">
            {usersQuery.error instanceof Error
              ? usersQuery.error.message
              : "Unknown error"}
          </p>
          <Button
            className="mt-3"
            onClick={() => usersQuery.refetch()}
            type="button"
            variant="secondary"
          >
            Retry
          </Button>
        </div>
      ) : null}

      {usersQuery.isLoading ? (
        <p className="text-muted-foreground shrink-0 text-sm">Loading users…</p>
      ) : null}

      {data && !usersQuery.isLoading ? (
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <div className="flex flex-col gap-1.5">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                Search
              </span>
              <input
                className="h-8 w-56 rounded-md border border-input bg-background px-3 text-sm shadow-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Name or phone…"
                type="search"
                value={searchInput}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                Group
              </span>
              <Select value={groupSelectValue} onValueChange={onGroupChange}>
                <SelectTrigger size="sm" className="w-56">
                  <SelectValue placeholder="All groups" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All groups</SelectItem>
                  {(groupsQuery.data?.data ?? []).map((g) => (
                    <SelectItem key={g.wid} value={g.wid}>
                      {g.name ?? g.wid}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <UsersDataTable data={data.data} />

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="whitespace-nowrap">Rows per page</span>
              <Select value={String(limitFromUrl)} onValueChange={onLimitChange}>
                <SelectTrigger size="sm" className="w-18">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {USER_PAGE_SIZES.map((n) => (
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
