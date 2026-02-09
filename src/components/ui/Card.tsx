import * as React from "react";
import { cn } from "@/lib/cn";

/** Card component (use shadow-soft when needed) */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  // Default to the common Figma export style: border 1px, radius 16px, padding 24px.
  return <div className={cn("rounded-md border border-border bg-bg p-6", className)} {...props} />;
}
