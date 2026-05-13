"use client";

import { useState } from "react";
import {
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { messagesColumns } from "@/components/messages-columns";
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
import type { SavedMessage } from "@/types/wassenger";

type MessagesDataTableProps = {
  data: SavedMessage[];
};

export function MessagesDataTable({ data }: MessagesDataTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // TanStack Table returns unstable function refs; React Compiler skips memoization (known pattern).
  // eslint-disable-next-line react-hooks/incompatible-library -- useReactTable is the supported API
  const table = useReactTable({
    data,
    columns: messagesColumns,
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
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.columnDef.meta?.label ?? column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-border">
        <Table className="min-w-[72rem] text-left text-sm">
          <TableHeader className="border-b border-border bg-muted text-muted-foreground shadow-sm [&_tr]:border-b-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-0 hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="sticky top-0 z-10 border-b border-border bg-muted px-3 py-2 font-medium"
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
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-3 py-2 align-top">
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
