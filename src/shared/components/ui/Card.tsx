import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "sport" | "dark" | "glass";
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
}

const variantClasses = {
  default: "bg-white border border-[#E2E8F0] shadow-[0_1px_3px_0_rgb(0_0_0/0.1)]",
  elevated: "bg-white border border-[#E2E8F0] shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)]",
  sport:
    "bg-white border-l-4 border-l-[#E84C1F] border-t border-r border-b border-[#E2E8F0] shadow-[0_1px_3px_0_rgb(0_0_0/0.1)]",
  dark: "bg-[#0F172A] border border-[#1E293B] text-white",
  glass:
    "bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-[0_8px_32px_0_rgb(31_38_135/0.37)]",
};

const paddingClasses = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      hoverable = false,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={[
          "rounded-xl",
          variantClasses[variant],
          paddingClasses[padding],
          hoverable
            ? "transition-all duration-200 hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)] hover:-translate-y-0.5 cursor-pointer"
            : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={["mb-4", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </div>
  )
);
CardHeader.displayName = "CardHeader";

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4";
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ as: Tag = "h3", children, className = "", ...props }, ref) => (
    <Tag
      ref={ref}
      className={["text-lg font-bold text-[#0F172A] leading-tight", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </Tag>
  )
);
CardTitle.displayName = "CardTitle";

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {}

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={["text-[#525252] text-sm leading-relaxed", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  )
);
CardBody.displayName = "CardBody";

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={[
        "mt-4 pt-4 border-t border-[#E2E8F0] flex items-center gap-3",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardBody, CardFooter };
export type { CardProps };
