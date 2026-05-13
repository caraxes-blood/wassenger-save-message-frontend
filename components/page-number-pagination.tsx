import Link from "next/link";

import { cn } from "@/lib/utils";

type Props = {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  buildHref: (p: number) => string;
};

export function PageNumberPagination({
  page,
  totalPages,
  hasNext,
  hasPrev,
  buildHref,
}: Props) {
  const windowStart = Math.max(1, page - 2);
  const windowEnd = Math.min(totalPages, page + 2);
  const pages: number[] = [];
  for (let p = windowStart; p <= windowEnd; p += 1) {
    pages.push(p);
  }

  const atFirst = page <= 1;
  const atLast = page >= totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-2 text-sm"
    >
      <PaginationLink disabled={atFirst} href={buildHref(1)} label="First" />
      <PaginationLink
        disabled={!hasPrev}
        href={buildHref(Math.max(1, page - 1))}
        label="Previous"
      />
      {pages.map((p) => (
        <Link
          key={p}
          className={cn(
            "inline-flex min-w-9 items-center justify-center rounded-md border px-2 py-1",
            p === page
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background hover:bg-muted",
          )}
          href={buildHref(p)}
        >
          {p}
        </Link>
      ))}
      <PaginationLink
        disabled={!hasNext}
        href={buildHref(Math.min(totalPages, page + 1))}
        label="Next"
      />
      <PaginationLink
        disabled={atLast}
        href={buildHref(totalPages)}
        label="Last"
      />
    </nav>
  );
}

function PaginationLink({
  href,
  label,
  disabled,
}: {
  href: string;
  label: string;
  disabled: boolean;
}) {
  if (disabled) {
    return (
      <span className="text-muted-foreground cursor-not-allowed px-2 py-1">
        {label}
      </span>
    );
  }
  return (
    <Link
      className="rounded-md border border-border bg-background px-2 py-1 hover:bg-muted"
      href={href}
    >
      {label}
    </Link>
  );
}
