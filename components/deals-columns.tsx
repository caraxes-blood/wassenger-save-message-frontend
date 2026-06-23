"use client";

import type { ColumnDef } from "@tanstack/react-table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { intentBadgeClasses } from "@/lib/intent-badge";
import { messageDateFmt, truncateMessagePreview } from "@/lib/message-display";
import { formatTableHeaderLabel } from "@/lib/utils";
import type { Deal } from "@/types/wassenger";

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

function ExpandableTextCell({
  value,
  label,
}: {
  value: string | null | undefined;
  label: string;
}) {
  const raw = typeof value === "string" ? value : "";
  const preview = truncateMessagePreview(raw, 120);
  if (!preview) {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-muted-foreground line-clamp-3 max-w-md cursor-pointer rounded text-left whitespace-pre-wrap wrap-break-word text-xs leading-relaxed transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          title="Click to view full text"
        >
          {preview}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription className="sr-only">
            Full {label.toLowerCase()} value
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto rounded-md border border-border bg-muted/30 p-3 text-sm whitespace-pre-wrap wrap-break-word select-text">
          {raw}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function IntentPill({ intent }: { intent: string }) {
  if (!intent) {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${intentBadgeClasses(intent)}`}
      title={intent}
    >
      {intent}
    </span>
  );
}

function formatDealPrice(
  amount: number | null,
  currency: string | null,
): string | null {
  if (amount === null || !Number.isFinite(amount)) return null;
  const cur = currency?.trim() || "USD";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: cur,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${cur}`;
  }
}

function PriceCell({
  amount,
  currency,
}: {
  amount: number | null;
  currency: string | null;
}) {
  const formatted = formatDealPrice(amount, currency);
  if (!formatted) {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <span className="messages-mono whitespace-nowrap text-xs" title={formatted}>
      {formatted}
    </span>
  );
}

export const dealsColumns: ColumnDef<Deal>[] = [
  {
    accessorKey: "id",
    meta: { label: "ID" },
    header: formatTableHeaderLabel("id"),
    cell: ({ row }) => (
      <span className="messages-mono text-muted-foreground text-xs">
        {row.getValue("id")}
      </span>
    ),
  },
  {
    accessorKey: "ref_number",
    meta: { label: "Ref number" },
    header: formatTableHeaderLabel("ref_number"),
    cell: ({ row }) => (
      <span className="messages-mono text-xs">{row.getValue("ref_number")}</span>
    ),
  },
  {
    accessorKey: "intent",
    meta: { label: "Intent" },
    header: formatTableHeaderLabel("intent"),
    cell: ({ row }) => <IntentPill intent={row.original.intent} />,
  },
  {
    id: "price",
    meta: { label: "Price" },
    header: formatTableHeaderLabel("price"),
    cell: ({ row }) => (
      <PriceCell
        amount={row.original.price_amount}
        currency={row.original.price_currency}
      />
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
    accessorKey: "group_name",
    meta: { label: "Group name" },
    header: formatTableHeaderLabel("group_name"),
    cell: ({ row }) => (
      <NullableText
        value={row.original.group_name}
        maxWidthClass="max-w-[220px] truncate"
      />
    ),
  },
  {
    accessorKey: "message_body",
    meta: { label: "Message body" },
    header: formatTableHeaderLabel("message_body"),
    cell: ({ row }) => (
      <ExpandableTextCell label="Message body" value={row.original.message_body} />
    ),
  },
  {
    accessorKey: "caption",
    meta: { label: "Caption" },
    header: formatTableHeaderLabel("caption"),
    cell: ({ row }) => (
      <ExpandableTextCell label="Caption" value={row.original.caption} />
    ),
  },
  {
    accessorKey: "message_timestamp",
    meta: { label: "Message timestamp" },
    header: formatTableHeaderLabel("message_timestamp"),
    cell: ({ row }) => (
      <span className="messages-mono text-muted-foreground whitespace-nowrap text-xs">
        {messageDateFmt.format(new Date(row.getValue("message_timestamp")))}
      </span>
    ),
  },
  {
    accessorKey: "created_at",
    meta: { label: "Created at" },
    header: formatTableHeaderLabel("created_at"),
    cell: ({ row }) => (
      <span className="messages-mono text-muted-foreground whitespace-nowrap text-xs">
        {messageDateFmt.format(new Date(row.getValue("created_at")))}
      </span>
    ),
  },
  {
    accessorKey: "message_id",
    meta: { label: "Message ID" },
    header: formatTableHeaderLabel("message_id"),
    cell: ({ row }) => (
      <span className="messages-mono text-xs">{row.getValue("message_id")}</span>
    ),
  },
  {
    accessorKey: "conversation_id",
    meta: { label: "Conversation" },
    header: formatTableHeaderLabel("conversation_id"),
    cell: ({ row }) => (
      <span className="messages-mono text-muted-foreground text-xs">
        {row.getValue("conversation_id")}
      </span>
    ),
  },
];
