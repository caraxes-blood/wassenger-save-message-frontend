"use client";

import { type ReactNode, useState } from "react";
import { type Table as TanstackTable, flexRender } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { formatReadableMessageDate } from "@/lib/message-display";
import { formatTableHeaderLabel } from "@/lib/utils";

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return !!target.closest("button, a, input, [role='switch']");
}

function isLikelyDateField(key: string): boolean {
  return /(?:^|_)(?:timestamp|date|at)$/i.test(key);
}

function toReadableDate(value: string): string | null {
  return formatReadableMessageDate(value);
}

function formatDetailValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string" && isLikelyDateField(key)) {
    return toReadableDate(value) ?? value;
  }
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

type DataTableProps<TData> = {
  table: TanstackTable<TData>;
  title: string;
  emptyMessage?: string;
  minWidthClassName?: string;
  filters?: ReactNode;
  renderDetails?: (row: TData) => ReactNode;
};

/** Shared compact table shell: filters + column visibility dropdown + row-click details modal. */
export function DataTable<TData>({
  table,
  title,
  emptyMessage = "No results.",
  minWidthClassName = "min-w-480",
  filters,
  renderDetails,
}: DataTableProps<TData>) {
  const [detailsRow, setDetailsRow] = useState<TData | null>(null);
  const visibleCount = table.getVisibleLeafColumns().length;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1.5">
      <div className="flex shrink-0 items-center justify-end gap-2">
        {filters}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" size="xs">
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
                  {formatTableHeaderLabel(
                    String(column.columnDef.meta?.label ?? column.id),
                  )}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="min-h-0 w-full max-w-full flex-1 overflow-x-auto overflow-y-auto rounded-md border border-border">
        <Table className={`${minWidthClassName} w-max max-w-none text-left text-xs`}>
          <TableHeader className="border-b border-border bg-primary text-primary-foreground shadow-sm [&_tr]:border-b-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-0 hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="sticky top-0 z-10 border-b border-primary-foreground/15 bg-primary px-2 py-1.5 text-[0.7rem] font-semibold tracking-wide text-primary-foreground uppercase"
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
                  className="cursor-pointer"
                  onClick={(e) => {
                    if (isInteractiveTarget(e.target)) return;
                    setDetailsRow(row.original);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-2 py-1 align-top">
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
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={detailsRow !== null}
        onOpenChange={(open) => !open && setDetailsRow(null)}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{title} details</DialogTitle>
            <DialogDescription className="sr-only">
              Full record details
            </DialogDescription>
          </DialogHeader>
          {detailsRow && renderDetails ? (
            <div className="max-h-[60vh] overflow-y-auto">{renderDetails(detailsRow)}</div>
          ) : (
            <dl className="grid max-h-[60vh] grid-cols-[minmax(0,140px)_1fr] gap-x-3 gap-y-2 overflow-y-auto text-sm">
              {detailsRow &&
                Object.entries(detailsRow as Record<string, unknown>).map(
                  ([key, value]) => (
                    <div className="contents" key={key}>
                      <dt className="text-muted-foreground pt-0.5 text-xs font-medium uppercase tracking-wide">
                        {formatTableHeaderLabel(key)}
                      </dt>
                      <dd className="select-text whitespace-pre-wrap wrap-break-word">
                        {formatDetailValue(key, value)}
                      </dd>
                    </div>
                  ),
                )}
            </dl>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
