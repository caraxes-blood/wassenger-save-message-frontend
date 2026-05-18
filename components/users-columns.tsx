"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { formatTableHeaderLabel } from "@/lib/utils";
import type { User } from "@/types/wassenger";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export const usersColumns: ColumnDef<User>[] = [
  {
    accessorKey: "phone",
    meta: { label: "Phone" },
    header: formatTableHeaderLabel("phone"),
    cell: ({ row }) => (
      <span className="messages-mono text-sm font-medium">
        {row.getValue("phone")}
      </span>
    ),
  },
  {
    accessorKey: "name",
    meta: { label: "Name" },
    header: formatTableHeaderLabel("name"),
    cell: ({ row }) => {
      const v = row.original.name;
      const s = typeof v === "string" ? v.trim() : "";
      if (!s) return <span className="text-muted-foreground">—</span>;
      return (
        <span className="max-w-[240px] truncate font-medium" title={s}>
          {s}
        </span>
      );
    },
  },
  {
    accessorKey: "wid",
    meta: { label: "WID" },
    header: formatTableHeaderLabel("wid"),
    cell: ({ row }) => {
      const v = row.original.wid;
      if (!v) return <span className="text-muted-foreground">—</span>;
      return (
        <span className="messages-mono text-muted-foreground text-xs">
          {v}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    meta: { label: "First seen" },
    header: formatTableHeaderLabel("created_at"),
    cell: ({ row }) => (
      <span className="messages-mono text-muted-foreground whitespace-nowrap text-xs">
        {dateFmt.format(new Date(row.getValue("created_at")))}
      </span>
    ),
  },
  {
    accessorKey: "updated_at",
    meta: { label: "Last updated" },
    header: formatTableHeaderLabel("updated_at"),
    cell: ({ row }) => (
      <span className="messages-mono text-muted-foreground whitespace-nowrap text-xs">
        {dateFmt.format(new Date(row.getValue("updated_at")))}
      </span>
    ),
  },
];
