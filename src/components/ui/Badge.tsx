import * as React from "react";
import { cn } from "@/lib/cn";

/** Pill badge (radius: 9999px) */
export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("inline-flex items-center rounded-pill border px-3 py-2 text-[16px] leading-none", className)}
      {...props}
    />
  );
}
