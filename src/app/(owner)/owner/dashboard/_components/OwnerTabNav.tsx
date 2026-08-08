import Link from "next/link";

const TABS = [
  { key: "listings", label: "My Courts" },
  { key: "bookings", label: "Bookings" },
  { key: "earnings", label: "Earnings" },
] as const;

export default function OwnerTabNav({ activeTab }: { activeTab: string }) {
  return (
    <div className="flex gap-1 bg-[#F1F5F9] p-1 rounded-xl w-fit">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          href={`?tab=${tab.key}`}
          className={[
            "px-5 py-2 rounded-lg text-sm font-semibold transition-all",
            activeTab === tab.key
              ? "bg-white text-[#0F172A] shadow-sm"
              : "text-[#737373] hover:text-[#0F172A]",
          ].join(" ")}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
