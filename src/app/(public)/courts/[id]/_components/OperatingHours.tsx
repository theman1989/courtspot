const DAYS_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_LABELS: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};
const DOW_TO_KEY = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

export default function OperatingHours({
  operatingHours,
}: {
  operatingHours: Record<string, { openingTime: string; closingTime: string }>;
}) {
  const todayKey = DOW_TO_KEY[new Date().getDay()];

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-4">
      <h2 className="text-lg font-black text-[#0F172A]">Operating Hours</h2>
      <div className="space-y-1">
        {DAYS_ORDER.map((day) => {
          const hours = operatingHours[day];
          const isToday = day === todayKey;
          return (
            <div
              key={day}
              className={`flex items-center justify-between py-2 px-3 rounded-xl text-sm transition-colors ${isToday ? "bg-[#FEF0EC]" : ""}`}
            >
              <span className={`font-semibold ${isToday ? "text-[#E84C1F]" : "text-[#0F172A]"}`}>
                {DAY_LABELS[day]}{isToday ? " · Today" : ""}
              </span>
              {hours ? (
                <span className={isToday ? "text-[#E84C1F] font-medium" : "text-[#525252]"}>
                  {formatTime(hours.openingTime)} – {formatTime(hours.closingTime)}
                </span>
              ) : (
                <span className="text-[#A3A3A3]">Closed</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
