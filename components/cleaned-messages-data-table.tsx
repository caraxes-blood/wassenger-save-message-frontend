"use client";

import { type ReactNode, useState } from "react";
import {
  type VisibilityState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { cleanedMessagesColumns } from "@/components/cleaned-messages-columns";
import { DataTable } from "@/components/data-table";
import type { CleanedMessage } from "@/types/wassenger";

type CleanedMessagesDataTableProps = {
  data: CleanedMessage[];
  filters?: ReactNode;
};

const defaultColumnVisibility: VisibilityState = {};

export function CleanedMessagesDataTable({ data, filters }: CleanedMessagesDataTableProps) {
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(defaultColumnVisibility);

  // eslint-disable-next-line react-hooks/incompatible-library -- useReactTable is the supported API
  const table = useReactTable({
    data,
    columns: cleanedMessagesColumns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <DataTable
      table={table}
      title="Cleaned message"
      emptyMessage="No cleaned messages found."
      filters={filters}
    />
  );
}
