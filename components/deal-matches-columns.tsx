"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { messageDateFmt } from "@/lib/message-display";
import { formatTableHeaderLabel } from "@/lib/utils";
import type { DealMatch } from "@/types/wassenger";

function formatDealPrice(
  amount: number | null,
  currency: string | null,
): string | null {
  if (amount === null || !Number.isFinite(amount)) return null;
  const cur = currency?.trim() || "USD";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: cur,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${cur}`;
  }
}

function PriceCell({
  amount,
  currency,
}: {
  amount: number | null;
  currency: string | null;
}) {
  const formatted = formatDealPrice(amount, currency);
  if (!formatted) {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <span className="messages-mono whitespace-nowrap text-xs" title={formatted}>
      {formatted}
    </span>
  );
}

function TextCell({ value }: { value: string | null }) {
  if (!value) return <span className="text-muted-foreground">—</span>;
  return (
    <span className="block max-w-60 truncate text-xs" title={value}>
      {value}
    </span>
  );
}

export const dealMatchesColumns: ColumnDef<DealMatch>[] = [
  {
    accessorKey: "id",
    meta: { label: "ID" },
    header: formatTableHeaderLabel("id"),
    cell: ({ row }) => (
      <span className="messages-mono text-muted-foreground text-xs">
        {row.getValue("id")}
      </span>
    ),
  },
  {
    accessorKey: "ref_number",
    meta: { label: "Ref number" },
    header: formatTableHeaderLabel("ref_number"),
    cell: ({ row }) => (
      <span className="messages-mono text-xs">{row.getValue("ref_number")}</span>
    ),
  },
  {
    accessorKey: "buyer_number",
    meta: { label: "Buyer #" },
    header: formatTableHeaderLabel("buyer_number"),
    cell: ({ row }) => (
      <span className="messages-mono text-xs whitespace-nowrap">
        {row.getValue("buyer_number")}
      </span>
    ),
  },
  {
    id: "buyer_price",
    meta: { label: "Buyer price" },
    header: formatTableHeaderLabel("buyer_price"),
    cell: ({ row }) => (
      <PriceCell
        amount={row.original.buyer_price_amount}
        currency={row.original.buyer_price_currency}
      />
    ),
  },
  {
    accessorKey: "buyer_group_name",
    meta: { label: "Buyer group" },
    header: formatTableHeaderLabel("buyer_group_name"),
    cell: ({ row }) => <TextCell value={row.getValue("buyer_group_name")} />,
  },
  {
    id: "buyer_message",
    meta: { label: "Buyer message" },
    header: formatTableHeaderLabel("buyer_message"),
    cell: ({ row }) => (
      <TextCell
        value={row.original.buyer_message_body ?? row.original.buyer_caption}
      />
    ),
  },
  {
    accessorKey: "seller_number",
    meta: { label: "Seller #" },
    header: formatTableHeaderLabel("seller_number"),
    cell: ({ row }) => (
      <span className="messages-mono text-xs whitespace-nowrap">
        {row.getValue("seller_number")}
      </span>
    ),
  },
  {
    id: "seller_price",
    meta: { label: "Seller price" },
    header: formatTableHeaderLabel("seller_price"),
    cell: ({ row }) => (
      <PriceCell
        amount={row.original.seller_price_amount}
        currency={row.original.seller_price_currency}
      />
    ),
  },
  {
    accessorKey: "seller_group_name",
    meta: { label: "Seller group" },
    header: formatTableHeaderLabel("seller_group_name"),
    cell: ({ row }) => <TextCell value={row.getValue("seller_group_name")} />,
  },
  {
    id: "seller_message",
    meta: { label: "Seller message" },
    header: formatTableHeaderLabel("seller_message"),
    cell: ({ row }) => (
      <TextCell
        value={row.original.seller_message_body ?? row.original.seller_caption}
      />
    ),
  },
  {
    accessorKey: "created_at",
    meta: { label: "Matched at" },
    header: formatTableHeaderLabel("matched_at"),
    cell: ({ row }) => (
      <span className="messages-mono text-muted-foreground whitespace-nowrap text-xs">
        {messageDateFmt.format(new Date(row.getValue("created_at")))}
      </span>
    ),
  },
  {
    accessorKey: "buyer_deal_id",
    meta: { label: "Buyer deal ID" },
    header: formatTableHeaderLabel("buyer_deal_id"),
    cell: ({ row }) => (
      <span className="messages-mono text-muted-foreground text-xs">
        {row.getValue("buyer_deal_id")}
      </span>
    ),
  },
  {
    accessorKey: "seller_deal_id",
    meta: { label: "Seller deal ID" },
    header: formatTableHeaderLabel("seller_deal_id"),
    cell: ({ row }) => (
      <span className="messages-mono text-muted-foreground text-xs">
        {row.getValue("seller_deal_id")}
      </span>
    ),
  },
];
