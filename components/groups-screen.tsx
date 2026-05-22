"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { GroupsDataTable } from "@/components/groups-data-table";
import { PageNumberPagination } from "@/components/page-number-pagination";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GROUP_PAGE_SIZES, parseGroupPageLimit } from "@/lib/groups-pagination";
import { clampPage } from "@/lib/messages-pagination";
import { createWassengerClient } from "@/lib/wassenger-axios";
import type { Group, GroupsPage } from "@/types/wassenger";

function buildGroupsPath(opts: { page: number; limit: number; q: string }): string {
  const params = new URLSearchParams();
  params.set("page", String(opts.page));
  params.set("limit", String(opts.limit));
  if (opts.q) params.set("q", opts.q);
  return `/groups?${params.toString()}`;
}

export function GroupsScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const api = useMemo(() => createWassengerClient(), []);
  const queryClient = useQueryClient();

  const rawPage = Number(searchParams.get("page") ?? "1");
  const pageFromUrl = clampPage(
    Number.isFinite(rawPage) ? Math.floor(rawPage) : 1,
    Number.MAX_SAFE_INTEGER,
  );
  const limitFromUrl = parseGroupPageLimit(searchParams.get("limit"));
  const qFromUrl = searchParams.get("q") ?? "";

  const [searchInput, setSearchInput] = useState(qFromUrl);
  const [pendingWids, setPendingWids] = useState<Set<string>>(new Set());
  const [toggleError, setToggleError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearchInput(qFromUrl);
  }, [qFromUrl]);

  function onSearchChange(value: string) {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      router.replace(buildGroupsPath({ page: 1, limit: limitFromUrl, q: value.trim() }));
    }, 350);
  }

  const groupsQueryKey = ["groups-page", pageFromUrl, limitFromUrl, qFromUrl];

  const groupsQuery = useQuery({
    queryKey: groupsQueryKey,
    queryFn: async () => {
      const res = await api.get<GroupsPage>("/groups", {
        params: {
          page: pageFromUrl,
          limit: limitFromUrl,
          ...(qFromUrl ? { q: qFromUrl } : {}),
        },
      });
      return res.data;
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ wid, active }: { wid: string; active: boolean }) => {
      const res = await api.patch<{ data: Group }>(`/groups/${encodeURIComponent(wid)}`, { active });
      return res.data.data;
    },
    onMutate: ({ wid, active }) => {
      setPendingWids((prev) => new Set(prev).add(wid));
      // Optimistic update
      queryClient.setQueryData<GroupsPage>(groupsQueryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((g) => (g.wid === wid ? { ...g, active } : g)),
        };
      });
    },
    onSuccess: (updated) => {
      setPendingWids((prev) => {
        const next = new Set(prev);
        next.delete(updated.wid);
        return next;
      });
      // Sync authoritative value from server
      queryClient.setQueryData<GroupsPage>(groupsQueryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((g) => (g.wid === updated.wid ? { ...g, ...updated } : g)),
        };
      });
      // Invalidate the groups list used by the users filter dropdown
      void queryClient.invalidateQueries({ queryKey: ["groups"] });
      setToggleError(null);
    },
    onError: (err, { wid }) => {
      setPendingWids((prev) => {
        const next = new Set(prev);
        next.delete(wid);
        return next;
      });
      void queryClient.invalidateQueries({ queryKey: groupsQueryKey });
      const msg = err instanceof Error ? err.message : String(err);
      setToggleError(`Failed to update group: ${msg}`);
    },
  });

  const handleToggleActive = useCallback(
    (wid: string, active: boolean) => {
      toggleMutation.mutate({ wid, active });
    },
    [toggleMutation],
  );

  const data = groupsQuery.data;
  const totalPages = data ? Math.max(1, data.totalPages) : 1;
  const safePage = clampPage(pageFromUrl, totalPages);

  useEffect(() => {
    if (!data) return;
    if (safePage !== pageFromUrl) {
      router.replace(buildGroupsPath({ page: safePage, limit: limitFromUrl, q: qFromUrl }));
    }
  }, [data, limitFromUrl, pageFromUrl, qFromUrl, router, safePage]);

  function buildHref(p: number) {
    return buildGroupsPath({ page: p, limit: limitFromUrl, q: qFromUrl });
  }

  function onLimitChange(next: string) {
    router.replace(buildGroupsPath({ page: 1, limit: Number(next), q: qFromUrl }));
  }

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-[min(100%,2200px)] flex-1 flex-col gap-4 overflow-hidden p-4 md:p-6">
      <header className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="messages-heading text-xl font-semibold tracking-tight">
            Groups
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
            <Link href="/users?page=1&limit=20">Users</Link>
          </Button>
        </div>
      </header>

      {groupsQuery.isError ? (
        <div className="shrink-0 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
          <p className="font-medium">Could not load groups</p>
          <p className="text-muted-foreground mt-1">
            {groupsQuery.error instanceof Error
              ? groupsQuery.error.message
              : "Unknown error"}
          </p>
          <Button
            className="mt-3"
            onClick={() => groupsQuery.refetch()}
            type="button"
            variant="secondary"
          >
            Retry
          </Button>
        </div>
      ) : null}

      {toggleError ? (
        <div className="shrink-0 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm">
          <p className="font-medium text-destructive">{toggleError}</p>
          <button
            className="text-muted-foreground mt-1 text-xs underline"
            type="button"
            onClick={() => setToggleError(null)}
          >
            Dismiss
          </button>
        </div>
      ) : null}

      {groupsQuery.isLoading ? (
        <p className="text-muted-foreground shrink-0 text-sm">Loading groups…</p>
      ) : null}

      {data && !groupsQuery.isLoading ? (
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <div className="flex flex-col gap-1.5">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                Search
              </span>
              <input
                className="h-8 w-56 rounded-md border border-input bg-background px-3 text-sm shadow-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Group name…"
                type="search"
                value={searchInput}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          <GroupsDataTable
            data={data.data}
            onToggleActive={handleToggleActive}
            pendingWids={pendingWids}
          />

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="whitespace-nowrap">Rows per page</span>
              <Select value={String(limitFromUrl)} onValueChange={onLimitChange}>
                <SelectTrigger size="sm" className="w-18">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GROUP_PAGE_SIZES.map((n) => (
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
