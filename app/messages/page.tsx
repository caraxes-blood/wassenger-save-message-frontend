import { Suspense } from "react";

import { MessagesScreen } from "@/components/messages-screen";

export default function MessagesRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground p-6 text-sm">Loading…</div>
      }
    >
      <MessagesScreen />
    </Suspense>
  );
}
