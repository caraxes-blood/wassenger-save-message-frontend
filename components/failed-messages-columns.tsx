"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { messageDateFmt, truncateMessagePreview } from "@/lib/message-display";
import type { FailedMessage } from "@/types/wassenger";

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

export const failedMessagesColumns: ColumnDef<FailedMessage>[] = [
  {
    accessorKey: "jobId",
    meta: { label: "Job ID" },
    header: "jobId",
    cell: ({ row }) => (
      <span className="messages-mono text-muted-foreground text-xs">
        {row.getValue("jobId")}
      </span>
    ),
  },
  {
    accessorKey: "messageId",
    meta: { label: "Message ID" },
    header: "messageId",
    cell: ({ row }) => (
      <span className="messages-mono text-xs">{row.getValue("messageId")}</span>
    ),
  },
  {
    accessorKey: "from",
    meta: { label: "From" },
    header: "from",
    cell: ({ row }) => (
      <span className="max-w-[180px] truncate" title={String(row.getValue("from"))}>
        {row.getValue("from")}
      </span>
    ),
  },
  {
    accessorKey: "type",
    meta: { label: "Type" },
    header: "type",
    cell: ({ row }) => <TypePill type={row.getValue("type")} />,
  },
  {
    accessorKey: "body",
    meta: { label: "Body" },
    header: "body",
    cell: ({ row }) => {
      const text = truncateMessagePreview(String(row.getValue("body") ?? ""), 120);
      return (
        <span className="text-muted-foreground line-clamp-3 max-w-md whitespace-pre-wrap wrap-break-word text-xs leading-relaxed">
          {text || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "failedAt",
    meta: { label: "Failed at" },
    header: "failedAt",
    cell: ({ row }) => (
      <span className="messages-mono text-muted-foreground whitespace-nowrap text-xs">
        {messageDateFmt.format(new Date(row.getValue("failedAt")))}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    meta: { label: "Created at" },
    header: "createdAt",
    cell: ({ row }) => (
      <span className="messages-mono text-muted-foreground whitespace-nowrap text-xs">
        {messageDateFmt.format(new Date(row.getValue("createdAt")))}
      </span>
    ),
  },
  {
    accessorKey: "error",
    meta: { label: "Error" },
    header: "error",
    cell: ({ row }) => (
      <span className="text-destructive max-w-lg wrap-break-word text-xs leading-relaxed whitespace-pre-wrap">
        {String(row.getValue("error") ?? "—")}
      </span>
    ),
  },
];
