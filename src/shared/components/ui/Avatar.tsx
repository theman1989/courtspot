import { HTMLAttributes, ImgHTMLAttributes, forwardRef } from "react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<AvatarSize, { root: string; text: string }> = {
  xs: { root: "w-6 h-6", text: "text-[10px]" },
  sm: { root: "w-8 h-8", text: "text-xs" },
  md: { root: "w-10 h-10", text: "text-sm" },
  lg: { root: "w-12 h-12", text: "text-base" },
  xl: { root: "w-16 h-16", text: "text-xl" },
};

interface AvatarRootProps extends HTMLAttributes<HTMLSpanElement> {
  size?: AvatarSize;
}

const Avatar = forwardRef<HTMLSpanElement, AvatarRootProps>(
  ({ size = "md", children, className = "", ...props }, ref) => (
    <span
      ref={ref}
      className={[
        "relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0",
        "bg-[#F1F5F9] border border-[#E2E8F0]",
        sizeClasses[size].root,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </span>
  )
);
Avatar.displayName = "Avatar";

interface AvatarImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: AvatarSize;
}

const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ alt = "", className = "", ...props }, ref) => (
    <img
      ref={ref}
      alt={alt}
      className={["w-full h-full object-cover", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  )
);
AvatarImage.displayName = "AvatarImage";

interface AvatarFallbackProps extends HTMLAttributes<HTMLSpanElement> {
  size?: AvatarSize;
  color?: "primary" | "secondary" | "accent";
}

const colorClasses = {
  primary: "bg-[#FEF0EC] text-[#E84C1F]",
  secondary: "bg-[#0F172A] text-white",
  accent: "bg-[#E0F9FD] text-[#0E7490]",
};

const AvatarFallback = forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ size = "md", color = "primary", children, className = "", ...props }, ref) => (
    <span
      ref={ref}
      className={[
        "flex items-center justify-center w-full h-full font-bold rounded-full",
        sizeClasses[size].text,
        colorClasses[color],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
      {...props}
    >
      {children}
    </span>
  )
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
export type { AvatarRootProps, AvatarSize };
