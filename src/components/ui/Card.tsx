import * as React from "react";
import { cn } from "@/lib/cn";

/** Card component (use shadow-soft when needed) */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border border-border bg-bg p-6", className)} {...props} />;
}
