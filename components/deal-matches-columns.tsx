"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { messageDateFmt } from "@/lib/message-display";
import { formatTableHeaderLabel } from "@/lib/utils";
import type { DealMatch, MatchedProduct } from "@/types/wassenger";

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

function fmt(amount: number | null, currency = "USD"): string {
  if (amount === null || !Number.isFinite(amount)) return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${currency}`;
  }
}

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return null;
  const isPurchased = /purchased|instock/i.test(status);
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${
        isPurchased
          ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
          : "border-border bg-muted text-muted-foreground"
      }`}
    >
      {status}
    </span>
  );
}

function ProductCard({ product }: { product: MatchedProduct }) {
  const discount =
    product.retail_online && product.retail_online_discount
      ? Math.round(
          ((product.retail_online - product.retail_online_discount) /
            product.retail_online) *
            100,
        )
      : null;

  const imgSrc = product.cover_photo
    ? `https://brickellwatches-resized.s3-us-west-2.amazonaws.com/${product.cover_photo}`
    : null;

  return (
    <div className="rounded-lg border border-border bg-muted/40 p-4">
      <div className="mb-3 flex items-start gap-3">
        {imgSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt={product.name}
            className="h-16 w-16 shrink-0 rounded-md border border-border object-cover"
          />
        )}
        <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{product.name}</p>
            <p className="messages-mono mt-0.5 text-xs text-muted-foreground">{product.ref}</p>
          </div>
          <StatusBadge status={product.status} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <PriceRow label="Retail" value={fmt(product.retail_online)} dimmed />
        <PriceRow label="Discounted" value={fmt(product.retail_online_discount)} highlight={discount !== null ? `-${discount}%` : undefined} />
        <PriceRow label="Sell price" value={fmt(product.sell_price)} />
        <PriceRow label="Sale price" value={fmt(product.new_sale_price)} accent />
      </div>
    </div>
  );
}

function PriceRow({
  label,
  value,
  dimmed,
  accent,
  highlight,
}: {
  label: string;
  value: string;
  dimmed?: boolean;
  accent?: boolean;
  highlight?: string;
}) {
  return (
    <div className="rounded-md border border-border bg-background px-2.5 py-2">
      <p className="mb-0.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <div className="flex items-baseline gap-1.5">
        <span
          className={`messages-mono text-sm font-semibold ${
            dimmed
              ? "text-muted-foreground line-through"
              : accent
                ? "text-primary"
                : "text-foreground"
          }`}
        >
          {value}
        </span>
        {highlight && (
          <span className="rounded border border-green-200 bg-green-50 px-1 py-px text-[9px] font-bold text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
            {highlight}
          </span>
        )}
      </div>
    </div>
  );
}

function ProductsCell({ products }: { products: MatchedProduct[] | null }) {
  const [open, setOpen] = useState(false);
  const count = products?.length ?? 0;

  if (count === 0) {
    return <span className="text-muted-foreground text-xs">—</span>;
  }

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <span>{count}</span>
        <span className="text-muted-foreground">{count === 1 ? "match" : "matches"}</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Matched Products</DialogTitle>
            <DialogDescription>
              {count} product{count !== 1 ? "s" : ""} matched for this deal
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[65vh] space-y-3 overflow-y-auto pr-1">
            {products!.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
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
    id: "matched_products",
    meta: { label: "Products" },
    header: formatTableHeaderLabel("matched_products"),
    cell: ({ row }) => (
      <ProductsCell products={row.original.matched_products} />
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
