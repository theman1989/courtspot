import { Card } from "@/shared/components/ui/Card";
import type { OwnerEarningsStats } from "@/features/booking/types";

export default function OwnerEarningsTab({ stats }: { stats: OwnerEarningsStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <Card variant="sport" padding="lg">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-[#737373] uppercase tracking-wider">
            Total Revenue
          </p>
          <p className="text-4xl font-black text-[#E84C1F]">
            ₱{stats.totalRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-[#A3A3A3]">From confirmed &amp; completed bookings</p>
        </div>
      </Card>

      <Card variant="default" padding="lg">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-[#737373] uppercase tracking-wider">
            Total Bookings
          </p>
          <p className="text-4xl font-black text-[#0F172A]">{stats.totalBookings}</p>
          <p className="text-sm text-[#A3A3A3]">Confirmed &amp; completed bookings</p>
        </div>
      </Card>
    </div>
  );
}
