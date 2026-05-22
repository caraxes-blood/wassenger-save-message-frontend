"use client";

import { useMemo, useState } from "react";
import {
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { createGroupsColumns } from "@/components/groups-columns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatTableHeaderLabel } from "@/lib/utils";
import type { Group } from "@/types/wassenger";

type GroupsDataTableProps = {
  data: Group[];
  onToggleActive: (wid: string, active: boolean) => void;
  pendingWids: Set<string>;
};

const defaultColumnVisibility: VisibilityState = {
  wid: false,
};

export function GroupsDataTable({ data, onToggleActive, pendingWids }: GroupsDataTableProps) {
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

  const visibleCount = table.getVisibleLeafColumns().length;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="flex shrink-0 justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" size="sm">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.getIsVisible()}
                  onCheckedChange={(v) => col.toggleVisibility(!!v)}
                >
                  {formatTableHeaderLabel(
                    String(col.columnDef.meta?.label ?? col.id),
                  )}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="min-h-0 w-full max-w-full flex-1 overflow-x-auto overflow-y-auto rounded-lg border border-border">
        <Table className="min-w-480 w-max max-w-none text-left text-sm">
          <TableHeader className="border-b border-border bg-primary text-primary-foreground shadow-sm [&_tr]:border-b-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-0 hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="sticky top-0 z-10 border-b border-primary-foreground/15 bg-primary px-3 py-2.5 text-base font-bold tracking-wide text-primary-foreground uppercase"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-3 py-2 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center text-muted-foreground"
                  colSpan={visibleCount || 1}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
