import * as React from "react";
import { QueryClientProvider as ReactQueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/infrastructure/lib/query-client";

export function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(() => queryClient);

  return <ReactQueryClientProvider client={client}>{children}</ReactQueryClientProvider>;
}
