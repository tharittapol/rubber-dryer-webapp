import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Input aligned to exported Figma CSS:
 * - Radius: 8px
 * - Height: 46px
 * - Border: #D9D9D9
 * - Focus ring: 6px outer ring
 */
export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-[46px] w-full rounded-sm border border-border bg-bg px-4 text-[16px] leading-[140%] outline-none",
        "focus:border-blue focus:shadow-ringBlue",
        className
      )}
      {...props}
    />
  );
}
