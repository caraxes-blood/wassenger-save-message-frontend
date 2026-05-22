"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Switch } from "@/components/ui/switch";
import { formatTableHeaderLabel } from "@/lib/utils";
import type { Group } from "@/types/wassenger";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function createGroupsColumns(
  onToggleActive: (wid: string, active: boolean) => void,
  pendingWids: Set<string>,
): ColumnDef<Group>[] {
  return [
    {
      accessorKey: "name",
      meta: { label: "Name" },
      header: formatTableHeaderLabel("name"),
      cell: ({ row }) => {
        const v = row.original.name;
        const s = typeof v === "string" ? v.trim() : "";
        if (!s) return <span className="text-muted-foreground">—</span>;
        return (
          <span className="max-w-[280px] truncate font-medium" title={s}>
            {s}
          </span>
        );
      },
    },
    {
      accessorKey: "active",
      meta: { label: "Active" },
      header: formatTableHeaderLabel("active"),
      cell: ({ row }) => {
        const { wid, active } = row.original;
        const isPending = pendingWids.has(wid);
        return (
          <Switch
            checked={active}
            disabled={isPending}
            onCheckedChange={(checked) => onToggleActive(wid, checked)}
          />
        );
      },
    },
    {
      accessorKey: "total_participants",
      meta: { label: "Members" },
      header: formatTableHeaderLabel("total_participants"),
      cell: ({ row }) => {
        const v = row.original.total_participants;
        if (v == null) return <span className="text-muted-foreground">—</span>;
        return <span className="messages-mono text-sm">{v}</span>;
      },
    },
    {
      accessorKey: "last_message_at",
      meta: { label: "Last message" },
      header: formatTableHeaderLabel("last_message_at"),
      cell: ({ row }) => {
        const v = row.original.last_message_at;
        if (!v) return <span className="text-muted-foreground">—</span>;
        return (
          <span className="messages-mono text-muted-foreground whitespace-nowrap text-xs">
            {dateFmt.format(new Date(v))}
          </span>
        );
      },
    },
    {
      accessorKey: "last_synced_at",
      meta: { label: "Last synced" },
      header: formatTableHeaderLabel("last_synced_at"),
      cell: ({ row }) => {
        const v = row.original.last_synced_at;
        if (!v) return <span className="text-muted-foreground">—</span>;
        return (
          <span className="messages-mono text-muted-foreground whitespace-nowrap text-xs">
            {dateFmt.format(new Date(v))}
          </span>
        );
      },
    },
    {
      accessorKey: "wid",
      meta: { label: "WID" },
      header: formatTableHeaderLabel("wid"),
      cell: ({ row }) => (
        <span className="messages-mono text-muted-foreground text-xs">
          {row.original.wid}
        </span>
      ),
    },
  ];
}
