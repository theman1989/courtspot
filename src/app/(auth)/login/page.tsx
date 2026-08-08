import LoginForm from "../_components/LoginForm";
import { Divider } from "@/shared/components/ui/Divider";

export default function Login() {
  return (
    <div className="min-h-screen flex bg-court-pattern">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-start justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-sport-gradient opacity-90" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute top-20 -left-12 w-64 h-64 rounded-full bg-white/5" />

        <div className="relative z-10">
          <CourtSpotLogo variant="light" size="lg" />
        </div>

        <div className="relative z-10 space-y-6 max-w-sm">
          <h1 className="text-4xl font-black text-white leading-tight tracking-tight">
            Find and Book Sports Courts
            <br />
            <span className="text-white/70">Near You.</span>
          </h1>
          <p className="text-white/60 text-base leading-relaxed">
            CourtSpot connects athletes with premium courts for every sport.
            Reserve your spot in seconds.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-2">
            {[
              { label: "Courts", value: "500+" },
              { label: "Sports", value: "12" },
              { label: "Players", value: "25K" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-white/60 font-medium mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-white/40 text-xs">
          © 2026 CourtSpot. All rights reserved.
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden">
            <CourtSpotLogo variant="dark" size="md" />
          </div>

          <div>
            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">
              Welcome back
            </h2>
            <p className="mt-1.5 text-[#737373] text-sm">
              Sign in to your account to continue
            </p>
          </div>

          <LoginForm />

          <Divider label="or continue with" />

          <div className="grid grid-cols-2 gap-3">
            <SocialButton icon="google" label="Google" />
            <SocialButton icon="apple" label="Apple" />
          </div>

          <p className="text-center text-sm text-[#737373]">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-[#E84C1F] hover:text-[#C93E18] transition-colors"
            >
              Create one for free
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

function CourtSpotLogo({
  variant = "dark",
  size = "md",
}: {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
}) {
  const textColor = variant === "light" ? "text-white" : "text-[#0F172A]";
  const sizeClass = size === "lg" ? "text-2xl" : size === "md" ? "text-xl" : "text-base";

  return (
    <div className={`flex items-center gap-2.5 ${sizeClass}`}>
      <div className="w-8 h-8 rounded-lg bg-[#E84C1F] flex items-center justify-center shrink-0 shadow-[0_4px_14px_0_rgb(232_76_31/0.4)]">
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      </div>
      <span className={`font-black tracking-tight ${textColor}`}>
        Court<span className={variant === "light" ? "text-white/70" : "text-[#E84C1F]"}>Spot</span>
      </span>
    </div>
  );
}

function SocialButton({ icon, label }: { icon: "google" | "apple"; label: string }) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2.5 h-11 rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] text-sm font-semibold hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#E84C1F] focus-visible:outline-offset-2"
    >
      {icon === "google" ? (
        <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
      ) : (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
      )}
      {label}
    </button>
  );
}
