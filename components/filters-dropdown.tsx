"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type FiltersDropdownProps = {
  activeCount: number;
  onClear: () => void;
  children: ReactNode;
};

/** Collapses filter fields behind a shadcn dropdown so the table owns the screen. */
export function FiltersDropdown({ activeCount, onClear, children }: FiltersDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          Filters{activeCount > 0 ? ` (${activeCount})` : ""}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-72 p-3"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex items-center justify-between">
          <DropdownMenuLabel className="px-0">Filters</DropdownMenuLabel>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="text-muted-foreground text-xs underline-offset-3 hover:text-foreground hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <DropdownMenuSeparator className="-mx-3" />
        <div className="flex flex-col gap-3 pt-1">{children}</div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
