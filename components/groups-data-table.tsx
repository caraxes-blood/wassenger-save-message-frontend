"use client";

import { type ReactNode, useMemo, useState } from "react";
import {
  type VisibilityState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { createGroupsColumns } from "@/components/groups-columns";
import { DataTable } from "@/components/data-table";
import type { Group } from "@/types/wassenger";

type GroupsDataTableProps = {
  data: Group[];
  onToggleActive: (wid: string, active: boolean) => void;
  pendingWids: Set<string>;
  filters?: ReactNode;
};

const defaultColumnVisibility: VisibilityState = {
  wid: false,
};

export function GroupsDataTable({ data, onToggleActive, pendingWids, filters }: GroupsDataTableProps) {
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(defaultColumnVisibility);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- pendingWids is a Set (referentially unstable); useMemo on its contents
  const columns = useMemo(() => createGroupsColumns(onToggleActive, pendingWids), [onToggleActive, pendingWids]);

  // eslint-disable-next-line react-hooks/incompatible-library -- useReactTable is the supported API
  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return <DataTable table={table} title="Group" emptyMessage="No groups found." filters={filters} />;
}
