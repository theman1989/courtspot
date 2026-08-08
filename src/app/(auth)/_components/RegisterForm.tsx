"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { registerSchema, type RegisterFormData } from "@/features/auth/schemas";
import { registerAction } from "@/features/auth/actions";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    const result = await registerAction(data);
    if (result?.error) {
      setError("root", { message: result.error });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Input
        label="Full name"
        type="text"
        autoComplete="name"
        placeholder="Alex Johnson"
        error={errors.name?.message}
        required
        leftAddon={
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        }
        {...register("name")}
      />

      <Input
        label="Email address"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        required
        leftAddon={
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        }
        {...register("email")}
      />

      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        placeholder="••••••••"
        error={errors.password?.message}
        hint="At least 8 characters"
        required
        leftAddon={
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
        }
        rightAddon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="hover:text-[#E84C1F] transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              {showPassword ? (
                <path
                  fillRule="evenodd"
                  d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                  clipRule="evenodd"
                />
              ) : (
                <>
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </>
              )}
            </svg>
          </button>
        }
        {...register("password")}
      />

      <Input
        label="Confirm password"
        type={showConfirm ? "text" : "password"}
        autoComplete="new-password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        required
        leftAddon={
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
        }
        rightAddon={
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="hover:text-[#E84C1F] transition-colors"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              {showConfirm ? (
                <path
                  fillRule="evenodd"
                  d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                  clipRule="evenodd"
                />
              ) : (
                <>
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </>
              )}
            </svg>
          </button>
        }
        {...register("confirmPassword")}
      />

      {errors.root && (
        <p role="alert" className="text-sm font-medium text-[#DC2626] flex items-center gap-1.5">
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 3.75a.75.75 0 011.5 0v4a.75.75 0 01-1.5 0v-4zm.75 7.25a.875.875 0 110-1.75.875.875 0 010 1.75z" />
          </svg>
          {errors.root.message}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isSubmitting}
      >
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
