import { Button } from "@/shared/components/ui/Button";
import { Card, CardHeader, CardTitle, CardBody, CardFooter } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/Avatar";
import { Divider } from "@/shared/components/ui/Divider";
import { Input } from "@/shared/components/ui/Input";

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-[#0F172A] border-b border-[#1E293B] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-1">
            {["Colors", "Typography", "Components", "Patterns"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="px-3 py-1.5 text-sm text-[#94A3B8] hover:text-white rounded-md hover:bg-white/5 transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
          <Badge variant="primary" size="md" dot>
            v1.0
          </Badge>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-20">
        {/* Hero */}
        <section className="text-center space-y-4 py-8">
          <Badge variant="primary" size="lg" dot>
            CourtSpot Design System
          </Badge>
          <h1 className="text-5xl font-black tracking-tight text-[#0F172A]">
            Sport{" "}
            <span className="text-gradient-sport">Design System</span>
          </h1>
          <p className="text-lg text-[#525252] max-w-xl mx-auto leading-relaxed">
            Energetic, accessible, and performant UI components built for CourtSpot.
            Designed with athletes in mind.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="primary" size="lg">Book a Court</Button>
            <Button variant="ghost" size="lg">Explore Courts</Button>
          </div>
        </section>

        <Divider variant="sport" />

        {/* Colors */}
        <section id="colors" className="space-y-8">
          <SectionHeader
            tag="Foundation"
            title="Color Palette"
            description="A bold, energetic palette designed for athletic brand identity."
          />

          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-[#737373] uppercase tracking-widest">Brand</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { name: "Primary", color: "#E84C1F", text: "#FFFFFF", label: "Brand Red-Orange" },
                { name: "Primary Hover", color: "#C93E18", text: "#FFFFFF", label: "#C93E18" },
                { name: "Primary Light", color: "#FEF0EC", text: "#E84C1F", label: "#FEF0EC" },
                { name: "Secondary", color: "#0F172A", text: "#FFFFFF", label: "Deep Navy" },
                { name: "Accent", color: "#22D3EE", text: "#0F172A", label: "Electric Blue" },
              ].map((swatch) => (
                <ColorSwatch key={swatch.name} {...swatch} />
              ))}
            </div>

            <h3 className="text-sm font-semibold text-[#737373] uppercase tracking-widest mt-8">Sport Palette</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: "Basketball", color: "#FF6B35", text: "#FFFFFF", label: "#FF6B35" },
                { name: "Tennis", color: "#84CC16", text: "#FFFFFF", label: "#84CC16" },
                { name: "Badminton", color: "#818CF8", text: "#FFFFFF", label: "#818CF8" },
                { name: "Volleyball", color: "#F59E0B", text: "#FFFFFF", label: "#F59E0B" },
                { name: "Swimming", color: "#0EA5E9", text: "#FFFFFF", label: "#0EA5E9" },
                { name: "Soccer", color: "#22C55E", text: "#FFFFFF", label: "#22C55E" },
              ].map((swatch) => (
                <ColorSwatch key={swatch.name} {...swatch} />
              ))}
            </div>

            <h3 className="text-sm font-semibold text-[#737373] uppercase tracking-widest mt-8">Semantic</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Success", color: "#16A34A", text: "#FFFFFF", label: "Available" },
                { name: "Warning", color: "#D97706", text: "#FFFFFF", label: "Limited" },
                { name: "Error", color: "#DC2626", text: "#FFFFFF", label: "Unavailable" },
                { name: "Info", color: "#2563EB", text: "#FFFFFF", label: "Information" },
              ].map((swatch) => (
                <ColorSwatch key={swatch.name} {...swatch} />
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* Typography */}
        <section id="typography" className="space-y-8">
          <SectionHeader
            tag="Foundation"
            title="Typography"
            description="Bold and athletic type scale. Heavy weights for impact, clean hierarchy for readability."
          />

          <div className="space-y-6 bg-white rounded-2xl border border-[#E2E8F0] p-8">
            <div className="space-y-1">
              <span className="text-xs font-medium text-[#A3A3A3] uppercase tracking-widest">Display / Hero</span>
              <p className="text-5xl font-black text-[#0F172A] tracking-tight leading-none">Book Your Court</p>
            </div>
            <Divider />
            <div className="space-y-1">
              <span className="text-xs font-medium text-[#A3A3A3] uppercase tracking-widest">Heading 1</span>
              <p className="text-4xl font-black text-[#0F172A] tracking-tight">Available Courts Near You</p>
            </div>
            <Divider />
            <div className="space-y-1">
              <span className="text-xs font-medium text-[#A3A3A3] uppercase tracking-widest">Heading 2</span>
              <p className="text-3xl font-bold text-[#0F172A]">Basketball Courts in Manila</p>
            </div>
            <Divider />
            <div className="space-y-1">
              <span className="text-xs font-medium text-[#A3A3A3] uppercase tracking-widest">Heading 3</span>
              <p className="text-2xl font-bold text-[#0F172A]">Court Availability</p>
            </div>
            <Divider />
            <div className="space-y-1">
              <span className="text-xs font-medium text-[#A3A3A3] uppercase tracking-widest">Body Large</span>
              <p className="text-lg text-[#525252] leading-relaxed">Find and reserve your ideal court for any sport. Real-time availability, instant booking, and flexible scheduling built for athletes.</p>
            </div>
            <Divider />
            <div className="space-y-1">
              <span className="text-xs font-medium text-[#A3A3A3] uppercase tracking-widest">Body / Caption</span>
              <p className="text-sm text-[#737373] leading-relaxed">Court opens daily from 6:00 AM to 10:00 PM. Booking must be made at least 1 hour in advance. Cancellations accepted up to 2 hours before slot.</p>
            </div>
            <Divider />
            <div className="space-y-1">
              <span className="text-xs font-medium text-[#A3A3A3] uppercase tracking-widest">Gradient Display</span>
              <p className="text-5xl font-black tracking-tight text-gradient-sport">CourtSpot</p>
            </div>
          </div>
        </section>

        <Divider />

        {/* Components */}
        <section id="components" className="space-y-12">
          <SectionHeader
            tag="Components"
            title="UI Components"
            description="Accessible, composable components with sport energy baked in."
          />

          {/* Buttons */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#0F172A]">Buttons</h3>
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 space-y-6">
              <div>
                <p className="text-xs font-medium text-[#A3A3A3] uppercase tracking-widest mb-4">Variants</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                </div>
              </div>
              <Divider />
              <div>
                <p className="text-xs font-medium text-[#A3A3A3] uppercase tracking-widest mb-4">Sizes</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </div>
              </div>
              <Divider />
              <div>
                <p className="text-xs font-medium text-[#A3A3A3] uppercase tracking-widest mb-4">States</p>
                <div className="flex flex-wrap gap-3">
                  <Button loading>Loading</Button>
                  <Button disabled>Disabled</Button>
                  <Button
                    leftIcon={
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                    }
                  >
                    Book Now
                  </Button>
                  <Button
                    variant="outline"
                    rightIcon={
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    }
                  >
                    View Courts
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#0F172A]">Badges</h3>
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 space-y-6">
              <div>
                <p className="text-xs font-medium text-[#A3A3A3] uppercase tracking-widest mb-4">Status</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="success" dot>Available</Badge>
                  <Badge variant="warning" dot>Limited</Badge>
                  <Badge variant="error" dot>Full</Badge>
                  <Badge variant="info" dot>Maintenance</Badge>
                  <Badge variant="default">Closed</Badge>
                  <Badge variant="outline">Indoor</Badge>
                </div>
              </div>
              <Divider />
              <div>
                <p className="text-xs font-medium text-[#A3A3A3] uppercase tracking-widest mb-4">Sport Types</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="basketball" dot>Basketball</Badge>
                  <Badge variant="tennis" dot>Tennis</Badge>
                  <Badge variant="badminton" dot>Badminton</Badge>
                  <Badge variant="volleyball" dot>Volleyball</Badge>
                  <Badge variant="swimming" dot>Swimming</Badge>
                  <Badge variant="soccer" dot>Soccer</Badge>
                </div>
              </div>
              <Divider />
              <div>
                <p className="text-xs font-medium text-[#A3A3A3] uppercase tracking-widest mb-4">Sizes</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge size="sm" variant="primary">Small</Badge>
                  <Badge size="md" variant="primary">Medium</Badge>
                  <Badge size="lg" variant="primary">Large</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#0F172A]">Inputs</h3>
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                <Input label="Default" placeholder="Search courts…" />
                <Input label="With hint" placeholder="e.g. Makati" hint="Enter your city or barangay" />
                <Input label="Required" placeholder="Your name" required />
                <Input label="With error" placeholder="Email address" error="Please enter a valid email" />
                <Input
                  label="With icon"
                  placeholder="Search courts…"
                  leftAddon={
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  }
                />
                <Input label="Disabled" placeholder="Unavailable" disabled />
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#0F172A]">Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card variant="default" hoverable>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="basketball" dot>Basketball</Badge>
                    <Badge variant="success" dot>Available</Badge>
                  </div>
                  <CardTitle className="mt-3">Rizal Memorial</CardTitle>
                </CardHeader>
                <CardBody>
                  Full-size hardwood court with professional lighting. Suitable for 5-on-5 matches.
                </CardBody>
                <CardFooter>
                  <span className="text-[#E84C1F] font-black text-lg">₱350</span>
                  <span className="text-[#A3A3A3] text-xs">/ hour</span>
                  <Button size="sm" className="ml-auto">Book</Button>
                </CardFooter>
              </Card>

              <Card variant="sport" hoverable>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="tennis" dot>Tennis</Badge>
                    <Badge variant="warning" dot>2 left</Badge>
                  </div>
                  <CardTitle className="mt-3">Manila Tennis Club</CardTitle>
                </CardHeader>
                <CardBody>
                  Hard court surface with floodlights. Racquet rental available on site.
                </CardBody>
                <CardFooter>
                  <span className="text-[#E84C1F] font-black text-lg">₱500</span>
                  <span className="text-[#A3A3A3] text-xs">/ hour</span>
                  <Button size="sm" className="ml-auto">Book</Button>
                </CardFooter>
              </Card>

              <Card variant="dark">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="swimming" dot>Swimming</Badge>
                    <Badge variant="error" dot>Full</Badge>
                  </div>
                  <CardTitle className="mt-3 text-white">ULTRA Sports Complex</CardTitle>
                </CardHeader>
                <CardBody>
                  <span className="text-[#94A3B8]">Olympic-standard 50m pool with 8 lanes and timing system.</span>
                </CardBody>
                <CardFooter className="border-[#1E293B]">
                  <span className="text-[#22D3EE] font-black text-lg">₱800</span>
                  <span className="text-[#4B5563] text-xs">/ hour</span>
                  <Button size="sm" variant="outline" className="ml-auto opacity-50 cursor-not-allowed" disabled>
                    Full
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Avatars */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#0F172A]">Avatars</h3>
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 space-y-6">
              <div>
                <p className="text-xs font-medium text-[#A3A3A3] uppercase tracking-widest mb-4">Sizes</p>
                <div className="flex items-end gap-4">
                  {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
                    <div key={s} className="flex flex-col items-center gap-2">
                      <Avatar size={s}>
                        <AvatarFallback size={s}>JD</AvatarFallback>
                      </Avatar>
                      <span className="text-[10px] text-[#A3A3A3] uppercase">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Divider />
              <div>
                <p className="text-xs font-medium text-[#A3A3A3] uppercase tracking-widest mb-4">Color variants</p>
                <div className="flex gap-4">
                  <Avatar size="lg">
                    <AvatarFallback size="lg" color="primary">KD</AvatarFallback>
                  </Avatar>
                  <Avatar size="lg">
                    <AvatarFallback size="lg" color="secondary">LJ</AvatarFallback>
                  </Avatar>
                  <Avatar size="lg">
                    <AvatarFallback size="lg" color="accent">SC</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* Patterns */}
        <section id="patterns" className="space-y-8">
          <SectionHeader
            tag="Patterns"
            title="UI Patterns"
            description="Real-world compositions that demonstrate the design system in context."
          />

          {/* Court booking card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#0F172A] rounded-2xl p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[#94A3B8] text-xs font-medium uppercase tracking-widest">Today, Aug 7</p>
                  <h3 className="text-white text-xl font-black mt-1">Quick Book</h3>
                </div>
                <Badge variant="primary" size="sm">Live</Badge>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {["6AM", "7AM", "8AM", "9AM", "10AM", "11AM"].map((slot, i) => (
                  <button
                    key={slot}
                    className={`rounded-lg py-2.5 text-xs font-semibold transition-all ${
                      i === 2
                        ? "bg-[#E84C1F] text-white shadow-[0_4px_14px_0_rgb(232_76_31/0.4)]"
                        : i === 4
                        ? "bg-[#1E293B] text-[#4B5563] cursor-not-allowed"
                        : "bg-[#1E293B] text-[#94A3B8] hover:bg-[#E84C1F]/10 hover:text-[#E84C1F]"
                    }`}
                    disabled={i === 4}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <Divider className="border-[#1E293B] my-0" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#94A3B8] text-xs">Selected</p>
                  <p className="text-white font-bold">8:00 AM – 9:00 AM</p>
                </div>
                <div className="text-right">
                  <p className="text-[#94A3B8] text-xs">Total</p>
                  <p className="text-[#E84C1F] font-black text-xl">₱350</p>
                </div>
              </div>

              <Button fullWidth variant="primary" size="lg">Confirm Booking</Button>
            </div>

            {/* Player stats card */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-5">
              <div className="flex items-center gap-4">
                <Avatar size="xl">
                  <AvatarFallback size="xl" color="primary">ET</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-black text-[#0F172A] text-lg">Emmanuel T.</h3>
                  <p className="text-[#737373] text-sm">Manila, Philippines</p>
                  <div className="flex gap-1.5 mt-1.5">
                    <Badge variant="basketball" size="sm">Basketball</Badge>
                    <Badge variant="soccer" size="sm">Soccer</Badge>
                  </div>
                </div>
              </div>

              <div className="h-0.5 bg-gradient-to-r from-[#E84C1F] to-[#22D3EE] rounded-full" />

              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: "Bookings", value: "48" },
                  { label: "Hours", value: "136" },
                  { label: "Courts", value: "12" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl font-black text-[#0F172A]">{s.value}</div>
                    <div className="text-xs text-[#A3A3A3] font-medium mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              <Divider />

              <div className="flex gap-2">
                <Button variant="primary" size="sm" fullWidth>Book Again</Button>
                <Button variant="ghost" size="sm" fullWidth>View History</Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0F172A] mt-20 border-t border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo />
          <p className="text-[#4B5563] text-sm">
            CourtSpot Design System · Built with Next.js + Tailwind CSS v4
          </p>
          <div className="flex gap-2">
            <Badge variant="success" size="sm" dot>Stable</Badge>
            <Badge variant="default" size="sm">v1.0.0</Badge>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-lg bg-[#E84C1F] flex items-center justify-center shadow-[0_4px_14px_0_rgb(232_76_31/0.4)]">
        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      </div>
      <span className="font-black text-white tracking-tight text-lg">
        Court<span className="text-[#E84C1F]">Spot</span>
      </span>
    </div>
  );
}

function SectionHeader({
  tag,
  title,
  description,
}: {
  tag: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-3">
      <Badge variant="primary" size="sm">{tag}</Badge>
      <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">{title}</h2>
      <p className="text-[#737373] text-base max-w-xl">{description}</p>
    </div>
  );
}

function ColorSwatch({
  name,
  color,
  text,
  label,
}: {
  name: string;
  color: string;
  text: string;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <div
        className="h-16 rounded-xl border border-black/5 shadow-sm"
        style={{ backgroundColor: color }}
      />
      <div>
        <p className="text-xs font-semibold text-[#0F172A]">{name}</p>
        <p className="text-[10px] text-[#A3A3A3] font-mono mt-0.5">{label}</p>
      </div>
    </div>
  );
}
