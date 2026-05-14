/** ≥0.9 green, 0.7–0.89 yellow, <0.7 red (0.7 and 0.9 inclusive in green/yellow bands per spec) */
export function confidenceBadgeClasses(confidence: number): string {
  if (!Number.isFinite(confidence)) {
    return "border-zinc-400/50 bg-zinc-500/12 text-zinc-900 dark:border-zinc-500/35 dark:bg-zinc-500/15 dark:text-zinc-100";
  }
  if (confidence >= 0.9) {
    return "border-emerald-600/35 bg-emerald-600/12 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-100";
  }
  if (confidence >= 0.7) {
    return "border-amber-500/45 bg-amber-500/12 text-amber-950 dark:border-amber-500/45 dark:bg-amber-500/15 dark:text-amber-50";
  }
  return "border-red-600/40 bg-red-600/12 text-red-800 dark:border-red-500/45 dark:bg-red-500/15 dark:text-red-100";
}
