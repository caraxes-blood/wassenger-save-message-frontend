import { Suspense } from "react";

import { DealsScreen } from "@/components/deals-screen";

export default function DealsRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground p-6 text-sm">Loading…</div>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <DealsScreen />
      </div>
    </Suspense>
  );
}
