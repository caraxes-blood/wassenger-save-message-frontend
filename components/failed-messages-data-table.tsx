"use client";

import { useState } from "react";
import {
  type VisibilityState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import { failedMessagesColumns } from "@/components/failed-messages-columns";
import type { FailedMessage } from "@/types/wassenger";

type FailedMessagesDataTableProps = {
  data: FailedMessage[];
};

export function FailedMessagesDataTable({ data }: FailedMessagesDataTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // TanStack Table returns unstable function refs; React Compiler skips memoization (known pattern).
  // eslint-disable-next-line react-hooks/incompatible-library -- useReactTable is the supported API
  const table = useReactTable({
    data,
    columns: failedMessagesColumns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <DataTable
      table={table}
      title="Failed message"
      emptyMessage="No failed messages found."
      minWidthClassName="min-w-[120rem]"
    />
  );
}
