"use client";

import { type ReactNode, useState } from "react";
import {
  type VisibilityState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import { dealMatchesColumns } from "@/components/deal-matches-columns";
import { formatReadableMessageDate } from "@/lib/message-display";
import type { DealMatch } from "@/types/wassenger";

type DealMatchesDataTableProps = {
  data: DealMatch[];
  filters?: ReactNode;
};

const defaultColumnVisibility: VisibilityState = {
  id: false,
  buyer_deal_id: false,
  seller_deal_id: false,
  buyer_group_name: false,
  buyer_message: false,
  seller_group_name: false,
  seller_message: false,
};

function displayText(value: string | null | undefined): string {
  return value && value.trim() ? value : "—";
}

function displayDate(value: string): string {
  return formatReadableMessageDate(value) ?? value;
}

function renderDetailRow(label: string, value: string) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">{label}</p>
      <p className="whitespace-pre-wrap wrap-break-word text-sm">{value}</p>
    </div>
  );
}

function renderBuyerSellerDetails(row: DealMatch) {
  const buyerMessage = displayText(row.buyer_message_body);
  const sellerMessage = displayText(row.seller_message_body);

  return (
    <div className="space-y-4 pr-1">
      <div className="rounded-md border border-border bg-muted/20 p-3">
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-[11px] tracking-wide uppercase">Ref number</p>
            <p className="messages-mono">{row.ref_number}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-[11px] tracking-wide uppercase">Matched at</p>
            <p className="messages-mono">{displayDate(row.created_at)}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <section className="space-y-3 rounded-md border border-border p-3">
          <h3 className="text-sm font-semibold">Buyer</h3>
          {renderDetailRow("Number", displayText(row.buyer_number))}
          {renderDetailRow("Price", `${row.buyer_price_amount ?? "—"} ${row.buyer_price_currency ?? ""}`.trim())}
          {renderDetailRow("Group", displayText(row.buyer_group_name))}
          {renderDetailRow("Time", displayDate(row.buyer_message_timestamp))}
          {renderDetailRow("Caption", displayText(row.buyer_caption))}
          {renderDetailRow("Message", buyerMessage)}
        </section>

        <section className="space-y-3 rounded-md border border-border p-3">
          <h3 className="text-sm font-semibold">Seller</h3>
          {renderDetailRow("Number", displayText(row.seller_number))}
          {renderDetailRow("Price", `${row.seller_price_amount ?? "—"} ${row.seller_price_currency ?? ""}`.trim())}
          {renderDetailRow("Group", displayText(row.seller_group_name))}
          {renderDetailRow("Time", displayDate(row.seller_message_timestamp))}
          {renderDetailRow("Caption", displayText(row.seller_caption))}
          {renderDetailRow("Message", sellerMessage)}
        </section>
      </div>
    </div>
  );
}

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
      renderDetails={renderBuyerSellerDetails}
    />
  );
}
