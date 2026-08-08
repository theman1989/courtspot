import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/auth";
import { getBookingById } from "@/features/booking/server/booking.service";

type Params = Promise<{ id: string }>;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(t: string) {
  const h = parseInt(t.split(":")[0]);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:00 ${ampm}`;
}

export default async function BookingConfirmationPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const booking = await getBookingById(id, session.user.id);

  if (!booking) notFound();

  return (
    <div className="max-w-lg mx-auto px-6 py-16 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#DCFCE7] flex items-center justify-center">
          <svg
            className="w-8 h-8 text-[#16A34A]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-[#0F172A]">
          Booking Confirmed!
        </h1>
        <p className="text-[#737373] text-sm">
          Your court is reserved. See you on the court!
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider">
            Booking Ref
          </span>
          <span className="text-xs font-mono text-[#525252] break-all text-right max-w-[60%]">
            {booking._id}
          </span>
        </div>

        <div className="h-px bg-[#E2E8F0]" />

        <div className="space-y-3">
          {[
            { label: "Court", value: booking.court?.name ?? "—" },
            { label: "Location", value: booking.court?.city ?? "—" },
            { label: "Date", value: formatDate(booking.date) },
            {
              label: "Time",
              value: `${formatTime(booking.startTime)} – ${formatTime(booking.endTime)}`,
            },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-start gap-4">
              <span className="text-sm text-[#A3A3A3] shrink-0">{label}</span>
              <span className="text-sm font-semibold text-[#0F172A] text-right">
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className="h-px bg-[#E2E8F0]" />

        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-[#525252]">
            Total Paid
          </span>
          <span className="text-xl font-black text-[#E84C1F]">
            ₱{booking.totalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Link
          href="/dashboard"
          className="w-full h-12 rounded-xl bg-[#E84C1F] text-white font-bold text-sm flex items-center justify-center shadow-[0_4px_14px_0_rgb(232_76_31/0.3)] hover:bg-[#C93E18] transition-colors"
        >
          View My Bookings
        </Link>
        <Link
          href="/courts"
          className="w-full h-12 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#525252] font-semibold text-sm flex items-center justify-center hover:bg-[#F1F5F9] transition-colors"
        >
          Browse More Courts
        </Link>
      </div>
    </div>
  );
}
