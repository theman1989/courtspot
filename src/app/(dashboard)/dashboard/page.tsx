import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { getBookerDashboardData } from "@/features/booking/server/booking.service";
import { Avatar, AvatarFallback } from "@/shared/components/ui/Avatar";
import BookingsTable from "@/features/booking/components/BookingsTable";

function getInitials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (!session.user.role.includes("booker")) redirect("/owner/dashboard");

  const { bookings, stats } = await getBookerDashboardData(session.user.id);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-5">
        <div className="flex items-center gap-4">
          <Avatar size="xl">
            <AvatarFallback size="xl" color="primary">
              {getInitials(session.user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-black text-[#0F172A] text-xl">{session.user.name}</h2>
            <p className="text-[#737373] text-sm">{session.user.email}</p>
          </div>
        </div>

        <div className="h-0.5 bg-gradient-to-r from-[#E84C1F] to-[#22D3EE] rounded-full" />

        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: "Bookings", value: stats.totalBookings },
            { label: "Hours", value: stats.totalHours },
            { label: "Courts", value: stats.distinctCourts },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-black text-[#0F172A]">{s.value}</div>
              <div className="text-xs text-[#A3A3A3] font-medium mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">My Bookings</h1>
        <BookingsTable bookings={bookings} />
      </div>
    </div>
  );
}
