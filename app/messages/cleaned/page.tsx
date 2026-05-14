import { Suspense } from "react";

import { CleanedMessagesScreen } from "@/components/cleaned-messages-screen";

export default function CleanedMessagesRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground p-6 text-sm">Loading…</div>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <CleanedMessagesScreen />
      </div>
    </Suspense>
  );
}
