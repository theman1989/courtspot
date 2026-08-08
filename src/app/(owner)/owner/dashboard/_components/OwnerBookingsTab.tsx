import { Badge } from "@/shared/components/ui/Badge";
import type { OwnerDashboardBooking } from "@/features/booking/types";

type BadgeVariantType = "success" | "warning" | "info" | "error" | "default";

const STATUS_CONFIG: Record<string, { variant: BadgeVariantType; label: string }> = {
  confirmed: { variant: "success", label: "Confirmed" },
  completed: { variant: "info", label: "Completed" },
  pending: { variant: "warning", label: "Pending" },
  failed: { variant: "error", label: "Failed" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

export default function OwnerBookingsTab({
  bookings,
}: {
  bookings: OwnerDashboardBooking[];
}) {
  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center space-y-3">
        <p className="text-[#0F172A] font-bold text-lg">No bookings yet</p>
        <p className="text-[#737373] text-sm">
          Bookings on your courts will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              {(["Court", "Booker", "Date", "Time", "Status", "Amount"] as const).map(
                (heading, i) => (
                  <th
                    key={heading}
                    className={`px-5 py-3 text-xs font-semibold text-[#737373] uppercase tracking-wider ${
                      i >= 4 ? "text-right" : "text-left"
                    }`}
                  >
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {bookings.map((booking) => {
              const statusCfg = STATUS_CONFIG[booking.status] ?? {
                variant: "default" as BadgeVariantType,
                label: booking.status,
              };
              return (
                <tr key={booking._id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 font-semibold text-[#0F172A]">
                    {booking.courtName}
                  </td>
                  <td className="px-5 py-4 text-[#525252]">{booking.bookerName}</td>
                  <td className="px-5 py-4 text-[#525252]">{formatDate(booking.date)}</td>
                  <td className="px-5 py-4 text-[#525252] whitespace-nowrap">
                    {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Badge variant={statusCfg.variant} dot size="sm">
                      {statusCfg.label}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-right font-black text-[#E84C1F]">
                    ₱{booking.totalPrice.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
