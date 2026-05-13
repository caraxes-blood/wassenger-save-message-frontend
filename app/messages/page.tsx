import { Suspense } from "react";

import { MessagesScreen } from "@/components/messages-screen";

export default function MessagesRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground p-6 text-sm">Loading…</div>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <MessagesScreen />
      </div>
    </Suspense>
  );
}
