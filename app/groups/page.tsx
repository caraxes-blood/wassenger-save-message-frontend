import { Suspense } from "react";

import { GroupsScreen } from "@/components/groups-screen";

export default function GroupsRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground p-6 text-sm">Loading…</div>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <GroupsScreen />
      </div>
    </Suspense>
  );
}
