import { InputHTMLAttributes, forwardRef, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      leftAddon,
      rightAddon,
      fullWidth = true,
      className = "",
      id: externalId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = externalId ?? generatedId;

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-semibold text-[#0F172A] mb-1.5"
          >
            {label}
            {props.required && (
              <span className="text-[#E84C1F] ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          {leftAddon && (
            <div className="absolute left-3 flex items-center justify-center text-[#737373] pointer-events-none">
              {leftAddon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${id}-error` : hint ? `${id}-hint` : undefined
            }
            className={[
              "w-full rounded-lg border bg-white text-[#0F172A] placeholder:text-[#A3A3A3]",
              "text-sm font-medium transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              error
                ? "border-[#DC2626] focus:ring-[#DC2626]/30 focus:border-[#DC2626]"
                : "border-[#E2E8F0] focus:ring-[#E84C1F]/25 focus:border-[#E84C1F]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#F5F5F5]",
              leftAddon ? "pl-10" : "pl-3.5",
              rightAddon ? "pr-10" : "pr-3.5",
              "py-2.5",
              "h-11",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />

          {rightAddon && (
            <div className="absolute right-3 flex items-center justify-center text-[#737373]">
              {rightAddon}
            </div>
          )}
        </div>

        {error ? (
          <p
            id={`${id}-error`}
            role="alert"
            className="mt-1.5 text-xs font-medium text-[#DC2626] flex items-center gap-1"
          >
            <svg
              className="w-3.5 h-3.5 shrink-0"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 3.75a.75.75 0 011.5 0v4a.75.75 0 01-1.5 0v-4zm.75 7.25a.875.875 0 110-1.75.875.875 0 010 1.75z" />
            </svg>
            {error}
          </p>
        ) : hint ? (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-[#737373]">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
