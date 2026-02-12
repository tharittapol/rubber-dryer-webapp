import React, { Suspense } from "react";
import { AppShellClient } from "./AppShellClient";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <AppShellClient>{children}</AppShellClient>
    </Suspense>
  );
}
