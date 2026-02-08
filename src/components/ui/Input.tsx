import * as React from "react";
import { cn } from "@/lib/cn";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-sm border border-border bg-bg px-3 text-[16px] outline-none",
        "focus:border-[color:#2B7FFF] focus:ring-2 focus:ring-[color:rgba(43,127,255,0.15)]",
        className
      )}
      {...props}
    />
  );
}
