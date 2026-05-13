import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

type Props = {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  buildHref: (p: number) => string;
};

function DisabledPageControl({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      aria-disabled
      className={cn(
        "inline-flex h-8 cursor-not-allowed items-center justify-center gap-1 rounded-lg px-2 text-sm text-muted-foreground opacity-45",
        className,
      )}
    >
      {children}
    </span>
  );
}

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

  const showLeadingEllipsis = windowStart > 2;
  const showTrailingEllipsis = windowEnd < totalPages - 1;

  return (
    <Pagination>
      <PaginationContent className="flex-wrap justify-center gap-1">
        <PaginationItem>
          {atFirst ? (
            <DisabledPageControl>First</DisabledPageControl>
          ) : (
            <PaginationLink href={buildHref(1)} size="default">
              First
            </PaginationLink>
          )}
        </PaginationItem>

        <PaginationItem>
          {!hasPrev ? (
            <DisabledPageControl className="pl-1.5">
              <ChevronLeftIcon className="size-4 shrink-0" data-icon="inline-start" />
              <span className="hidden sm:inline">Previous</span>
            </DisabledPageControl>
          ) : (
            <PaginationPrevious href={buildHref(Math.max(1, page - 1))} />
          )}
        </PaginationItem>

        {windowStart > 1 ? (
          <PaginationItem>
            <PaginationLink href={buildHref(1)} isActive={page === 1} size="icon">
              1
            </PaginationLink>
          </PaginationItem>
        ) : null}

        {showLeadingEllipsis ? (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        ) : null}

        {pages.map((p) => {
          if (p === 1 && windowStart > 1) return null;
          if (p === totalPages && windowEnd < totalPages) return null;
          return (
            <PaginationItem key={p}>
              <PaginationLink
                href={buildHref(p)}
                isActive={p === page}
                size="icon"
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {showTrailingEllipsis ? (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        ) : null}

        {windowEnd < totalPages ? (
          <PaginationItem>
            <PaginationLink
              href={buildHref(totalPages)}
              isActive={page === totalPages}
              size="icon"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        ) : null}

        <PaginationItem>
          {!hasNext ? (
            <DisabledPageControl className="pr-1.5">
              <span className="hidden sm:inline">Next</span>
              <ChevronRightIcon className="size-4 shrink-0" data-icon="inline-end" />
            </DisabledPageControl>
          ) : (
            <PaginationNext
              href={buildHref(Math.min(totalPages, page + 1))}
            />
          )}
        </PaginationItem>

        <PaginationItem>
          {atLast ? (
            <DisabledPageControl>Last</DisabledPageControl>
          ) : (
            <PaginationLink href={buildHref(totalPages)} size="default">
              Last
            </PaginationLink>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
