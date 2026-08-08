import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { getOwnerDashboardListings } from "@/features/listing";
import { getOwnerDashboardBookings, getOwnerEarningsStats } from "@/features/booking";
import OwnerTabNav from "./_components/OwnerTabNav";
import OwnerListingsTab from "./_components/OwnerListingsTab";
import OwnerBookingsTab from "./_components/OwnerBookingsTab";
import OwnerEarningsTab from "./_components/OwnerEarningsTab";

const VALID_TABS = ["listings", "bookings", "earnings"] as const;
type Tab = (typeof VALID_TABS)[number];

function resolveTab(raw: string | string[] | undefined): Tab {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value && (VALID_TABS as readonly string[]).includes(value)) return value as Tab;
  return "listings";
}

export default async function OwnerDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!session.user.role.includes("owner")) redirect("/dashboard");

  const { tab } = await searchParams;
  const activeTab = resolveTab(tab);
  const ownerId = session.user.id;

  let content: React.ReactNode;
  if (activeTab === "listings") {
    const listings = await getOwnerDashboardListings(ownerId);
    content = <OwnerListingsTab listings={listings} />;
  } else if (activeTab === "bookings") {
    const bookings = await getOwnerDashboardBookings(ownerId);
    content = <OwnerBookingsTab bookings={bookings} />;
  } else {
    const stats = await getOwnerEarningsStats(ownerId);
    content = <OwnerEarningsTab stats={stats} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Owner Dashboard</h1>
        <p className="text-[#737373] text-sm">Manage your courts, bookings, and earnings</p>
      </div>

      <OwnerTabNav activeTab={activeTab} />

      {content}
    </div>
  );
}
