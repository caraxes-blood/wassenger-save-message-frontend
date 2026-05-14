"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { confidenceBadgeClasses } from "@/lib/confidence-badge";
import { messageDateFmt, truncateMessagePreview } from "@/lib/message-display";
import { formatTableHeaderLabel } from "@/lib/utils";
import type { CleanedMessage } from "@/types/wassenger";

const usdFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function intentBadgeClasses(intent: string): string {
  const t = intent.trim().toLowerCase();
  const map: Record<string, string> = {
    buy: "border-sky-400/50 bg-sky-500/15 text-sky-950 dark:border-sky-500/40 dark:bg-sky-500/20 dark:text-sky-50",
    sell: "border-violet-400/50 bg-violet-500/15 text-violet-950 dark:border-violet-500/40 dark:bg-violet-500/20 dark:text-violet-50",
    inquiry:
      "border-teal-400/50 bg-teal-500/15 text-teal-950 dark:border-teal-500/40 dark:bg-teal-500/20 dark:text-teal-50",
    other:
      "border-zinc-400/50 bg-zinc-500/12 text-zinc-900 dark:border-zinc-500/35 dark:bg-zinc-500/15 dark:text-zinc-100",
  };
  return (
    map[t] ??
    "border-zinc-400/50 bg-zinc-500/12 text-zinc-900 dark:border-zinc-500/35 dark:bg-zinc-500/15 dark:text-zinc-100"
  );
}

function IntentPill({ intent }: { intent: string }) {
  const s = typeof intent === "string" ? intent.trim() : "";
  if (!s) {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <span
      className={`inline-flex max-w-[120px] truncate rounded-full border px-2 py-0.5 text-xs font-medium ${intentBadgeClasses(s)}`}
      title={s}
    >
      {s}
    </span>
  );
}

function ConfidenceBadge({ value }: { value: number }) {
  const pct = Number.isFinite(value)
    ? `${Math.round(value * 100)}%`
    : "—";
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${confidenceBadgeClasses(value)}`}
      title={String(value)}
    >
      {pct}
    </span>
  );
}

function NullableText({
  value,
  maxWidthClass,
}: {
  value: string | null | undefined;
  maxWidthClass?: string;
}) {
  const s = typeof value === "string" ? value.trim() : "";
  if (!s) {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <span className={maxWidthClass} title={s}>
      {s}
    </span>
  );
}

export const cleanedMessagesColumns: ColumnDef<CleanedMessage>[] = [
  {
    accessorKey: "timestamp",
    meta: { label: "Timestamp" },
    header: formatTableHeaderLabel("timestamp"),
    cell: ({ row }) => (
      <span className="messages-mono text-muted-foreground whitespace-nowrap text-xs">
        {messageDateFmt.format(new Date(row.getValue("timestamp")))}
      </span>
    ),
  },
  {
    accessorKey: "sender",
    meta: { label: "Sender" },
    header: formatTableHeaderLabel("sender"),
    cell: ({ row }) => (
      <span className="max-w-[180px] truncate" title={String(row.getValue("sender"))}>
        {row.getValue("sender")}
      </span>
    ),
  },
  {
    accessorKey: "clean_body",
    meta: { label: "Clean body" },
    header: formatTableHeaderLabel("clean_body"),
    cell: ({ row }) => {
      const raw = row.original.clean_body;
      const text = truncateMessagePreview(
        typeof raw === "string" ? raw : "",
        160,
      );
      return (
        <span className="text-muted-foreground line-clamp-3 max-w-md whitespace-pre-wrap wrap-break-word text-xs leading-relaxed">
          {text || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "intent",
    meta: { label: "Intent" },
    header: formatTableHeaderLabel("intent"),
    cell: ({ row }) => <IntentPill intent={row.original.intent} />,
  },
  {
    accessorKey: "confidence",
    meta: { label: "Confidence" },
    header: formatTableHeaderLabel("confidence"),
    cell: ({ row }) => <ConfidenceBadge value={row.original.confidence} />,
  },
  {
    accessorKey: "watch_ref",
    meta: { label: "Watch ref" },
    header: formatTableHeaderLabel("watch_ref"),
    cell: ({ row }) => (
      <NullableText
        value={row.original.watch_ref}
        maxWidthClass="max-w-[200px] truncate"
      />
    ),
  },
  {
    accessorKey: "price_usd",
    meta: { label: "Price USD" },
    header: formatTableHeaderLabel("price_usd"),
    cell: ({ row }) => {
      const v = row.original.price_usd;
      if (v == null || !Number.isFinite(v)) {
        return <span className="text-muted-foreground">—</span>;
      }
      return (
        <span className="messages-mono whitespace-nowrap text-xs">
          {usdFmt.format(v)}
        </span>
      );
    },
  },
  {
    accessorKey: "condition",
    meta: { label: "Condition" },
    header: formatTableHeaderLabel("condition"),
    cell: ({ row }) => (
      <NullableText
        value={row.original.condition}
        maxWidthClass="max-w-[140px] truncate"
      />
    ),
  },
  {
    accessorKey: "language",
    meta: { label: "Language" },
    header: formatTableHeaderLabel("language"),
    cell: ({ row }) => (
      <span className="messages-mono uppercase text-xs">
        {row.getValue("language") || "—"}
      </span>
    ),
  },
];
