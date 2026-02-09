import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "default" | "figma40";

/**
 * Reusable input:
 * - default: 46px (current app baseline)
 * - figma40: 40px (Login / compact forms)
 */
export function Input({
  className,
  variant = "default",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { variant?: Variant }) {
  const base =
    "w-full rounded-sm border border-border bg-bg px-4 text-[16px] outline-none focus:border-blue focus:shadow-ringBlue";

  const variants: Record<Variant, string> = {
    default: "h-[46px] leading-[140%]",
    // Figma login: height 40 + padding 12 16 + line-height 100%
    figma40: "h-[40px] py-[12px] leading-[100%]",
  };

  return <input className={cn(base, variants[variant], className)} {...props} />;
}
