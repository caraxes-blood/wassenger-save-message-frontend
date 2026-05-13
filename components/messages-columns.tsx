"use client";

import type { ColumnDef } from "@tanstack/react-table";

import {
  getMessageType,
  getPreview,
  messageDateFmt,
  truncateMessagePreview,
} from "@/lib/message-display";
import type { SavedMessage } from "@/types/wassenger";

function TypePill({ type }: { type: string }) {
  if (!type) {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <span
      className="inline-flex max-w-[140px] truncate rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-foreground"
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
    header: "id",
    cell: ({ row }) => (
      <span className="messages-mono text-muted-foreground text-xs">
        {row.getValue("id")}
      </span>
    ),
  },
  {
    accessorKey: "message_id",
    meta: { label: "Message ID" },
    header: "message_id",
    cell: ({ row }) => (
      <span className="messages-mono text-xs">{row.getValue("message_id")}</span>
    ),
  },
  {
    accessorKey: "sender",
    meta: { label: "Sender" },
    header: "sender",
    cell: ({ row }) => (
      <span className="max-w-[180px] truncate" title={String(row.getValue("sender"))}>
        {row.getValue("sender")}
      </span>
    ),
  },
  {
    accessorKey: "conversation_id",
    meta: { label: "Conversation" },
    header: "conversation_id",
    cell: ({ row }) => (
      <span className="messages-mono text-muted-foreground text-xs">
        {row.getValue("conversation_id")}
      </span>
    ),
  },
  {
    accessorKey: "timestamp",
    meta: { label: "Timestamp" },
    header: "timestamp",
    cell: ({ row }) => (
      <span className="messages-mono text-muted-foreground whitespace-nowrap text-xs">
        {messageDateFmt.format(new Date(row.getValue("timestamp")))}
      </span>
    ),
  },
  {
    id: "type",
    meta: { label: "Type" },
    header: "type",
    accessorFn: (row) => getMessageType(row.payload),
    cell: ({ row }) => (
      <TypePill type={getMessageType(row.original.payload)} />
    ),
  },
  {
    id: "preview",
    meta: { label: "Preview" },
    header: "preview",
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
