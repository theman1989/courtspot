import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#E84C1F] text-white hover:bg-[#C93E18] active:bg-[#B03515] shadow-[0_4px_14px_0_rgb(232_76_31/0.3)] hover:shadow-[0_6px_20px_0_rgb(232_76_31/0.4)]",
  secondary:
    "bg-[#0F172A] text-white hover:bg-[#1E293B] active:bg-[#0A1020]",
  ghost:
    "bg-transparent text-[#0F172A] hover:bg-[#F1F5F9] active:bg-[#E2E8F0]",
  outline:
    "bg-transparent border border-[#E84C1F] text-[#E84C1F] hover:bg-[#FEF0EC] active:bg-[#FDE0D5]",
  danger:
    "bg-[#DC2626] text-white hover:bg-[#B91C1C] active:bg-[#991B1B]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
  md: "h-10 px-4 text-sm gap-2 rounded-lg",
  lg: "h-12 px-6 text-base gap-2.5 rounded-lg",
  xl: "h-14 px-8 text-lg gap-3 rounded-xl",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={[
          "inline-flex items-center justify-center font-semibold tracking-wide",
          "transition-all duration-150 ease-out",
          "focus-visible:outline-2 focus-visible:outline-[#E84C1F] focus-visible:outline-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
          "select-none cursor-pointer",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth ? "w-full" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-4 w-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {!loading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
