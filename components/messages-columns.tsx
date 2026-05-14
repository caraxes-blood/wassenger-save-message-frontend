"use client";

import type { ColumnDef } from "@tanstack/react-table";

import {
  getMessageType,
  getPreview,
  messageDateFmt,
  truncateMessagePreview,
} from "@/lib/message-display";
import { typeBadgeClasses } from "@/lib/type-badge";
import { formatTableHeaderLabel } from "@/lib/utils";
import type { SavedMessage } from "@/types/wassenger";

function RelevantBadge({ value }: { value: boolean | undefined }) {
  if (value === undefined) {
    return <span className="text-muted-foreground">—</span>;
  }
  if (value) {
    return (
      <span
        className="inline-flex rounded-full border border-emerald-600/35 bg-emerald-600/12 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-100"
        title="Relevant"
      >
        Relevant
      </span>
    );
  }
  return (
    <span
      className="inline-flex rounded-full border border-red-600/40 bg-red-600/12 px-2 py-0.5 text-xs font-medium text-red-800 dark:border-red-500/45 dark:bg-red-500/15 dark:text-red-100"
      title="Not relevant"
    >
      Not relevant
    </span>
  );
}

function SkipReasonBadge({ reason }: { reason: string | null | undefined }) {
  const text = typeof reason === "string" ? reason.trim() : "";
  if (!text) {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <span
      className="inline-flex max-w-xs wrap-break-word rounded-full border border-orange-500/40 bg-orange-500/12 px-2 py-0.5 text-left text-xs font-medium text-orange-900 dark:border-orange-500/45 dark:bg-orange-500/15 dark:text-orange-50"
      title={text}
    >
      {text}
    </span>
  );
}

function TypePill({ type }: { type: string }) {
  if (!type) {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <span
      className={`inline-flex max-w-[140px] truncate rounded-full border px-2 py-0.5 text-xs font-medium ${typeBadgeClasses(type)}`}
      title={type}
    >
      {type}
    </span>
  );
}

export const messagesColumns: ColumnDef<SavedMessage>[] = [
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
    accessorKey: "message_id",
    meta: { label: "Message ID" },
    header: formatTableHeaderLabel("message_id"),
    cell: ({ row }) => (
      <span className="messages-mono text-xs">{row.getValue("message_id")}</span>
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
    accessorKey: "sender_name",
    meta: { label: "Sender name" },
    header: formatTableHeaderLabel("sender_name"),
    cell: ({ row }) => {
      const v = row.original.sender_name;
      const s = typeof v === "string" ? v.trim() : "";
      if (!s) return <span className="text-muted-foreground">—</span>;
      return (
        <span className="max-w-[200px] truncate" title={s}>
          {s}
        </span>
      );
    },
  },
  {
    accessorKey: "chat_name",
    meta: { label: "Chat name" },
    header: formatTableHeaderLabel("chat_name"),
    cell: ({ row }) => {
      const v = row.original.chat_name;
      const s = typeof v === "string" ? v.trim() : "";
      if (!s) return <span className="text-muted-foreground">—</span>;
      return (
        <span className="max-w-[220px] truncate" title={s}>
          {s}
        </span>
      );
    },
  },
  {
    accessorKey: "is_relevant",
    meta: { label: "Relevant" },
    header: formatTableHeaderLabel("is_relevant"),
    cell: ({ row }) => <RelevantBadge value={row.original.is_relevant} />,
  },
  {
    accessorKey: "skip_reason",
    meta: { label: "Skip reason" },
    header: formatTableHeaderLabel("skip_reason"),
    cell: ({ row }) => <SkipReasonBadge reason={row.original.skip_reason} />,
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
    id: "type",
    meta: { label: "Type" },
    header: formatTableHeaderLabel("type"),
    accessorFn: (row) => getMessageType(row.payload),
    cell: ({ row }) => (
      <TypePill type={getMessageType(row.original.payload)} />
    ),
  },
  {
    id: "preview",
    meta: { label: "Preview" },
    header: formatTableHeaderLabel("preview"),
    accessorFn: (row) => getPreview(row.payload),
    cell: ({ row }) => {
      const text = truncateMessagePreview(
        getPreview(row.original.payload),
        120,
      );
      return (
        <span className="text-muted-foreground line-clamp-3 max-w-md whitespace-pre-wrap wrap-break-word text-xs leading-relaxed">
          {text || "—"}
        </span>
      );
    },
  },
];
