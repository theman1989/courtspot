import { HTMLAttributes, forwardRef } from "react";

type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "basketball"
  | "tennis"
  | "badminton"
  | "volleyball"
  | "swimming"
  | "soccer"
  | "outline";

type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-[#F1F5F9] text-[#0F172A]",
  primary: "bg-[#FEF0EC] text-[#E84C1F]",
  success: "bg-[#DCFCE7] text-[#16A34A]",
  warning: "bg-[#FEF3C7] text-[#D97706]",
  error: "bg-[#FEE2E2] text-[#DC2626]",
  info: "bg-[#DBEAFE] text-[#2563EB]",
  outline: "bg-transparent border border-[#CBD5E1] text-[#525252]",
  basketball: "bg-[#FFF1EB] text-[#FF6B35]",
  tennis: "bg-[#F0FBE4] text-[#65A30D]",
  badminton: "bg-[#EEF2FF] text-[#6366F1]",
  volleyball: "bg-[#FFFBEB] text-[#D97706]",
  swimming: "bg-[#E0F2FE] text-[#0284C7]",
  soccer: "bg-[#DCFCE7] text-[#16A34A]",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-[#94A3B8]",
  primary: "bg-[#E84C1F]",
  success: "bg-[#16A34A]",
  warning: "bg-[#D97706]",
  error: "bg-[#DC2626]",
  info: "bg-[#2563EB]",
  outline: "bg-[#94A3B8]",
  basketball: "bg-[#FF6B35]",
  tennis: "bg-[#84CC16]",
  badminton: "bg-[#818CF8]",
  volleyball: "bg-[#F59E0B]",
  swimming: "bg-[#0EA5E9]",
  soccer: "bg-[#22C55E]",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px] gap-1",
  md: "px-2.5 py-1 text-xs gap-1.5",
  lg: "px-3 py-1.5 text-sm gap-2",
};

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "default",
      size = "md",
      dot = false,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={[
          "inline-flex items-center rounded-full font-semibold uppercase tracking-wider leading-none",
          variantClasses[variant],
          sizeClasses[size],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {dot && (
          <span
            className={[
              "rounded-full shrink-0",
              size === "sm" ? "w-1.5 h-1.5" : size === "md" ? "w-2 h-2" : "w-2.5 h-2.5",
              dotColors[variant],
            ].join(" ")}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
export type { BadgeProps, BadgeVariant, BadgeSize };
