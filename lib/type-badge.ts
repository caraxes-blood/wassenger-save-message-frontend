/** Distinct badge styles per Whats-style message / media type */
export function typeBadgeClasses(type: string): string {
  const t = type.trim().toLowerCase();
  const map: Record<string, string> = {
    text: "border-sky-400/50 bg-sky-500/15 text-sky-950 dark:border-sky-500/40 dark:bg-sky-500/20 dark:text-sky-50",
    image:
      "border-fuchsia-400/50 bg-fuchsia-500/15 text-fuchsia-950 dark:border-fuchsia-500/40 dark:bg-fuchsia-500/20 dark:text-fuchsia-50",
    video:
      "border-violet-400/50 bg-violet-500/15 text-violet-950 dark:border-violet-500/40 dark:bg-violet-500/20 dark:text-violet-50",
    audio:
      "border-amber-400/50 bg-amber-500/15 text-amber-950 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-50",
    ptt: "border-amber-400/50 bg-amber-500/15 text-amber-950 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-50",
    document:
      "border-orange-400/50 bg-orange-500/15 text-orange-950 dark:border-orange-500/40 dark:bg-orange-500/20 dark:text-orange-50",
    sticker:
      "border-pink-400/50 bg-pink-500/15 text-pink-950 dark:border-pink-500/40 dark:bg-pink-500/20 dark:text-pink-50",
    location:
      "border-emerald-400/50 bg-emerald-500/15 text-emerald-950 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-50",
    contact:
      "border-teal-400/50 bg-teal-500/15 text-teal-950 dark:border-teal-500/40 dark:bg-teal-500/20 dark:text-teal-50",
    poll: "border-cyan-400/50 bg-cyan-500/15 text-cyan-950 dark:border-cyan-500/40 dark:bg-cyan-500/20 dark:text-cyan-50",
    list: "border-cyan-400/50 bg-cyan-500/15 text-cyan-950 dark:border-cyan-500/40 dark:bg-cyan-500/20 dark:text-cyan-50",
    reaction:
      "border-rose-400/50 bg-rose-500/15 text-rose-950 dark:border-rose-500/40 dark:bg-rose-500/20 dark:text-rose-50",
    unknown:
      "border-zinc-400/50 bg-zinc-500/12 text-zinc-900 dark:border-zinc-500/35 dark:bg-zinc-500/15 dark:text-zinc-100",
  };
  return map[t] ?? map.unknown;
}
