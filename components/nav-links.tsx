"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

export type NavLink = { href: string; label: string };

type NavLinksProps = {
  links: NavLink[];
  className?: string;
};

/** Compact text-link row for inter-page routing — replaces heavy button nav. */
export function NavLinks({ links, className }: NavLinksProps) {
  return (
    <nav className={cn("flex flex-wrap items-center text-xs", className)}>
      {links.map((link, i) => (
        <span key={link.href} className="flex items-center">
          {i > 0 && (
            <span aria-hidden className="text-muted-foreground/40 px-1.5">
              ·
            </span>
          )}
          <Link
            href={link.href}
            className="text-muted-foreground underline-offset-3 transition-colors hover:text-foreground hover:underline"
          >
            {link.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}

export function LogoutLink({
  busy,
  onClick,
}: {
  busy: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={busy}
      onClick={onClick}
      className="text-destructive text-xs underline-offset-3 transition-colors hover:underline disabled:opacity-50"
    >
      {busy ? "Signing out…" : "Log out"}
    </button>
  );
}
