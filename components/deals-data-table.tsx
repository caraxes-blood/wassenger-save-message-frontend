"use client";

import { type ReactNode, useState } from "react";
import {
  type VisibilityState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import { dealsColumns } from "@/components/deals-columns";
import type { Deal } from "@/types/wassenger";

type DealsDataTableProps = {
  data: Deal[];
  filters?: ReactNode;
};

const defaultColumnVisibility: VisibilityState = {
  id: false,
  message_id: false,
  conversation_id: false,
  created_at: false,
};

export function DealsDataTable({ data, filters }: DealsDataTableProps) {
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(defaultColumnVisibility);

  // TanStack Table returns unstable function refs; React Compiler skips memoization (known pattern).
  // eslint-disable-next-line react-hooks/incompatible-library -- useReactTable is the supported API
  const table = useReactTable({
    data,
    columns: dealsColumns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return <DataTable table={table} title="Deal" emptyMessage="No deals found." filters={filters} />;
}
