import { Suspense } from "react";

import { FailedMessagesScreen } from "@/components/failed-messages-screen";

export default function FailedMessagesRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground p-6 text-sm">Loading…</div>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <FailedMessagesScreen />
      </div>
    </Suspense>
  );
}
