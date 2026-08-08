import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import Link from "next/link";
import { Badge } from "@/shared/components/ui/Badge";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  const dashboardHref =
    session?.user.role === "owner" ? "/owner/dashboard" : "/dashboard";

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-[#0F172A] border-b border-[#1E293B] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/courts"
              className="text-sm font-medium text-[#94A3B8] hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-white/5"
            >
              Browse Courts
            </Link>
            {session ? (
              <Link
                href={dashboardHref}
                className="h-8 px-4 inline-flex items-center rounded-lg bg-[#1E293B] text-white text-sm font-semibold hover:bg-[#334155] transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-[#94A3B8] hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-white/5"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="h-8 px-4 inline-flex items-center rounded-lg bg-[#E84C1F] text-white text-sm font-semibold hover:bg-[#C93E18] transition-colors shadow-[0_4px_14px_0_rgb(232_76_31/0.3)]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-court-pattern min-h-[90vh] flex items-center">
          <div className="max-w-7xl mx-auto px-6 py-24 w-full">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div>
                <Badge variant="primary" size="md" dot>
                  Metro Manila · Now Booking
                </Badge>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white leading-none">
                Find Your Court.<br />
                <span className="text-gradient-sport">Book It.</span> Play.
              </h1>
              <p className="text-lg md:text-xl text-[#94A3B8] leading-relaxed max-w-2xl mx-auto">
                Browse courts across Metro Manila. Instant booking for basketball,
                badminton, tennis, and futsal — with secure PH payment.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  href="/courts"
                  className="h-14 px-8 inline-flex items-center rounded-xl bg-[#E84C1F] text-white text-lg font-semibold hover:bg-[#C93E18] transition-all shadow-[0_4px_14px_0_rgb(232_76_31/0.4)] hover:shadow-[0_8px_25px_0_rgb(232_76_31/0.5)] active:scale-95"
                >
                  Browse Courts
                </Link>
                <Link
                  href="/register"
                  className="h-14 px-8 inline-flex items-center rounded-xl border border-white/20 text-white text-lg font-semibold hover:bg-white/10 transition-all active:scale-95"
                >
                  List Your Court
                </Link>
              </div>
              <div className="flex items-center justify-center gap-6 pt-2 text-sm text-[#4B5563]">
                <span>15+ Courts</span>
                <span className="w-1 h-1 rounded-full bg-[#1E293B]" />
                <span>4 Sports</span>
                <span className="w-1 h-1 rounded-full bg-[#1E293B]" />
                <span>Metro Manila</span>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-[#F8FAFC] py-24">
          <div className="max-w-7xl mx-auto px-6 space-y-16">
            <div className="text-center space-y-3">
              <Badge variant="primary" size="sm">How It Works</Badge>
              <h2 className="text-4xl font-black text-[#0F172A] tracking-tight">
                Book in 3 Easy Steps
              </h2>
              <p className="text-[#737373] max-w-lg mx-auto">
                From discovery to game time — CourtSpot makes it fast and effortless.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {STEPS.map(({ step, title, description, icon }) => (
                <div
                  key={step}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-8 space-y-5 relative overflow-hidden"
                >
                  <span className="absolute top-4 right-6 text-6xl font-black text-[#F1F5F9] select-none leading-none">
                    {step}
                  </span>
                  <div className="w-14 h-14 rounded-xl bg-[#FEF0EC] flex items-center justify-center text-[#E84C1F] relative z-10">
                    {icon}
                  </div>
                  <div className="space-y-2 relative z-10">
                    <h3 className="text-xl font-black text-[#0F172A]">{title}</h3>
                    <p className="text-[#737373] leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sport Categories */}
        <section className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-6 space-y-16">
            <div className="text-center space-y-3">
              <Badge variant="primary" size="sm">Sports</Badge>
              <h2 className="text-4xl font-black text-[#0F172A] tracking-tight">
                Find Courts by Sport
              </h2>
              <p className="text-[#737373] max-w-lg mx-auto">
                We cover the most popular court sports across Metro Manila.
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {SPORTS.map(({ sport, bg, href }) => (
                <Link
                  key={sport}
                  href={href}
                  className={`${bg} rounded-2xl p-8 flex flex-col items-start justify-between text-white group hover:scale-[1.02] transition-transform min-h-[200px]`}
                >
                  <p className="text-sm font-semibold uppercase tracking-widest opacity-70">
                    Metro Manila
                  </p>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-black">{sport}</h3>
                    <div className="flex items-center gap-1.5 text-sm font-semibold opacity-80 group-hover:opacity-100 group-hover:gap-2.5 transition-all">
                      Explore courts
                      <ArrowRightIcon />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-court-pattern py-24">
          <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
              Ready to get on the court?
            </h2>
            <p className="text-lg text-[#94A3B8] max-w-xl mx-auto">
              Whether you're a player looking for a court or an owner ready to
              list your facility — CourtSpot has you covered.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/courts"
                className="h-14 px-8 inline-flex items-center rounded-xl bg-[#E84C1F] text-white text-lg font-semibold hover:bg-[#C93E18] transition-all shadow-[0_4px_14px_0_rgb(232_76_31/0.4)] active:scale-95"
              >
                Browse Courts
              </Link>
              <Link
                href="/register"
                className="h-14 px-8 inline-flex items-center rounded-xl border border-white/20 text-white text-lg font-semibold hover:bg-white/10 transition-all active:scale-95"
              >
                List Your Court
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0F172A] border-t border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo />
          <p className="text-[#4B5563] text-sm">
            © 2026 CourtSpot · Built for Metro Manila.
          </p>
          <nav className="flex items-center gap-4 text-sm text-[#4B5563]">
            <Link href="/courts" className="hover:text-[#94A3B8] transition-colors">
              Courts
            </Link>
            <Link href="/login" className="hover:text-[#94A3B8] transition-colors">
              Login
            </Link>
            <Link href="/register" className="hover:text-[#94A3B8] transition-colors">
              Sign Up
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

const STEPS = [
  {
    step: "01",
    title: "Search Courts",
    description:
      "Filter by sport, location, price, and available time slots. Find exactly what you need.",
    icon: (
      <svg
        className="w-7 h-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Book Instantly",
    description:
      "Reserve your slot in seconds. Pay securely via GCash, Maya, or credit card.",
    icon: (
      <svg
        className="w-7 h-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Show Up & Play",
    description:
      "Just arrive at your booked time. Your confirmation is all you need.",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z" />
      </svg>
    ),
  },
];

const SPORTS = [
  { sport: "Basketball", bg: "bg-[#FF6B35]", href: "/courts?sport=basketball" },
  { sport: "Badminton", bg: "bg-[#818CF8]", href: "/courts?sport=badminton" },
  { sport: "Tennis", bg: "bg-[#84CC16]", href: "/courts?sport=tennis" },
  { sport: "Futsal", bg: "bg-[#22C55E]", href: "/courts?sport=futsal" },
];

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-lg bg-[#E84C1F] flex items-center justify-center shadow-[0_4px_14px_0_rgb(232_76_31/0.4)]">
        <svg
          className="w-4 h-4 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      </div>
      <span className="font-black text-white tracking-tight text-lg">
        Court<span className="text-[#E84C1F]">Spot</span>
      </span>
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}
