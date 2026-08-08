import { HTMLAttributes, forwardRef } from "react";

interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  variant?: "default" | "sport";
  orientation?: "horizontal" | "vertical";
}

const Divider = forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      label,
      variant = "default",
      orientation = "horizontal",
      className = "",
      ...props
    },
    ref
  ) => {
    if (orientation === "vertical") {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="vertical"
          className={[
            "self-stretch w-px bg-[#E2E8F0]",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
      );
    }

    if (label) {
      return (
        <div
          ref={ref}
          role="separator"
          className={["flex items-center gap-3 my-4", className]
            .filter(Boolean)
            .join(" ")}
          {...props}
        >
          <div className="flex-1 h-px bg-[#E2E8F0]" />
          <span className="text-xs font-medium text-[#A3A3A3] uppercase tracking-widest whitespace-nowrap">
            {label}
          </span>
          <div className="flex-1 h-px bg-[#E2E8F0]" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="separator"
        className={[
          "w-full my-4",
          variant === "sport"
            ? "h-0.5 bg-gradient-to-r from-[#E84C1F] to-[#22D3EE] rounded-full"
            : "h-px bg-[#E2E8F0]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    );
  }
);

Divider.displayName = "Divider";

export { Divider };
export type { DividerProps };
