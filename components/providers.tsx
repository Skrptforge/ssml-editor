"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
const queryClient = new QueryClient();
export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
