import { Suspense } from "react";

import { UsersScreen } from "@/components/users-screen";

export default function UsersRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground p-6 text-sm">Loading…</div>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <UsersScreen />
      </div>
    </Suspense>
  );
}
