"use client";

import { type ReactNode, useState } from "react";
import {
  type VisibilityState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import { usersColumns } from "@/components/users-columns";
import type { User } from "@/types/wassenger";

type UsersDataTableProps = {
  data: User[];
  filters?: ReactNode;
};

const defaultColumnVisibility: VisibilityState = {
  wid: false,
  updated_at: false,
};

export function UsersDataTable({ data, filters }: UsersDataTableProps) {
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(defaultColumnVisibility);

  // eslint-disable-next-line react-hooks/incompatible-library -- useReactTable is the supported API
  const table = useReactTable({
    data,
    columns: usersColumns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return <DataTable table={table} title="User" emptyMessage="No users found." filters={filters} />;
}
