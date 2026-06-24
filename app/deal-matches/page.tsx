import { Suspense } from "react";

import { DealMatchesScreen } from "@/components/deal-matches-screen";

export default function DealMatchesRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground p-6 text-sm">Loading…</div>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <DealMatchesScreen />
      </div>
    </Suspense>
  );
}
