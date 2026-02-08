import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "danger";
type Size = "md" | "sm";

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-sm border px-4 font-semibold transition active:translate-y-[1px] disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<Variant, string> = {
    primary: "border-[color:#2C2C2C] bg-[color:#2C2C2C] text-white hover:opacity-90",
    ghost: "border-border bg-bg text-text hover:bg-surface",
    danger: "border-red bg-red text-white hover:opacity-90",
  };
  const sizes: Record<Size, string> = {
    md: "h-11 text-[16px]",
    sm: "h-9 text-[14px]",
  };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
