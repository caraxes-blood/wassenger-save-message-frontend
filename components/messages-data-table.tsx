"use client";

import { useState } from "react";
import {
  type VisibilityState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import { messagesColumns } from "@/components/messages-columns";
import type { SavedMessage } from "@/types/wassenger";

type MessagesDataTableProps = {
  data: SavedMessage[];
};

const defaultColumnVisibility: VisibilityState = {
  id: false,
  message_id: false,
  conversation_id: false,
  created_at: false,
  image_url: false,
};

export function MessagesDataTable({ data }: MessagesDataTableProps) {
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(defaultColumnVisibility);

  // TanStack Table returns unstable function refs; React Compiler skips memoization (known pattern).
  // eslint-disable-next-line react-hooks/incompatible-library -- useReactTable is the supported API
  const table = useReactTable({
    data,
    columns: messagesColumns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return <DataTable table={table} title="Message" emptyMessage="No messages found." />;
}
