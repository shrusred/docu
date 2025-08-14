// app/providers.tsx
"use client";

import type { ReactNode, ReactElement } from "react";
// import { ThemeProvider } from "next-themes";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { Toaster } from "sonner";

export default function Providers({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return <>{children}</>;
}
