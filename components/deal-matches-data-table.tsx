"use client";

import { type ReactNode, useState } from "react";
import {
  type VisibilityState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import { dealMatchesColumns } from "@/components/deal-matches-columns";
import type { DealMatch } from "@/types/wassenger";

type DealMatchesDataTableProps = {
  data: DealMatch[];
  filters?: ReactNode;
};

const defaultColumnVisibility: VisibilityState = {
  id: false,
  buyer_deal_id: false,
  seller_deal_id: false,
};

export function DealMatchesDataTable({ data, filters }: DealMatchesDataTableProps) {
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(defaultColumnVisibility);

  // TanStack Table returns unstable function refs; React Compiler skips memoization (known pattern).
  // eslint-disable-next-line react-hooks/incompatible-library -- useReactTable is the supported API
  const table = useReactTable({
    data,
    columns: dealMatchesColumns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <DataTable
      table={table}
      title="Deal match"
      emptyMessage="No deal matches found."
      filters={filters}
    />
  );
}
