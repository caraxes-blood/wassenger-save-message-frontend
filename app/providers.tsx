"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000 },
        },
      }),
  );
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <QueryClientProvider client={client}>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </QueryClientProvider>
    </div>
  );
}
