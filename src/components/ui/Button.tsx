import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "danger";
type Size = "md" | "sm" | "figma40";

/**
 * Reusable button sizes:
 * - md: 46px (current baseline)
 * - figma40: 40px (Login / compact)
 */
export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-sm border font-semibold transition active:translate-y-[1px] disabled:opacity-50 disabled:pointer-events-none";

  const variants: Record<Variant, string> = {
    primary: "border-ink bg-ink text-white hover:opacity-90",
    ghost: "border-border bg-bg text-text hover:bg-surface",
    danger: "border-red bg-red text-white hover:opacity-90",
  };

  const sizes: Record<Size, string> = {
    md: "h-[46px] px-4 text-[16px] leading-[140%]",
    sm: "h-[40px] px-3 text-[14px] leading-[140%]",
    // Figma login: height 40 + line-height 100% (single-line)
    figma40: "h-[40px] px-4 text-[16px] leading-[100%]",
  };

  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
