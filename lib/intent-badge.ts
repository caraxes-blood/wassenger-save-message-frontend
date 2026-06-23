/** Intent badge styles for deal rows */
export function intentBadgeClasses(intent: string): string {
  const t = intent.trim().toLowerCase();
  const map: Record<string, string> = {
    buy: "border-emerald-600/35 bg-emerald-600/12 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-100",
    sell: "border-sky-400/50 bg-sky-500/15 text-sky-950 dark:border-sky-500/40 dark:bg-sky-500/20 dark:text-sky-50",
    unknown:
      "border-border bg-muted/50 text-muted-foreground dark:border-border dark:bg-muted/40 dark:text-muted-foreground",
  };
  return map[t] ?? map.unknown;
}
