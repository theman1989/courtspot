import Link from "next/link";
import type { BrowseCourtListing } from "@/features/listing";

const SPORT_COLORS: Record<string, { bg: string; label: string; chip: string }> = {
  basketball: { bg: "#FF6B35", label: "Basketball", chip: "bg-[#FFF1EB] text-[#FF6B35]" },
  badminton:  { bg: "#818CF8", label: "Badminton",  chip: "bg-[#EEF2FF] text-[#6366F1]" },
  tennis:     { bg: "#84CC16", label: "Tennis",     chip: "bg-[#F0FBE4] text-[#65A30D]" },
  futsal:     { bg: "#22C55E", label: "Futsal",     chip: "bg-[#DCFCE7] text-[#16A34A]" },
  pickleball: { bg: "#F59E0B", label: "Pickleball", chip: "bg-[#FFFBEB] text-[#D97706]" },
};

function StarRating({ rating, count }: { rating: number; count: number }) {
  const display = rating > 0 ? rating.toFixed(1) : "—";
  return (
    <div className="flex items-center gap-1">
      <svg className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span className="text-xs font-semibold text-[#0F172A]">{display}</span>
      {count > 0 && (
        <span className="text-xs text-[#A3A3A3]">({count})</span>
      )}
    </div>
  );
}

export default function CourtCard({ court }: { court: BrowseCourtListing }) {
  const sport = SPORT_COLORS[court.sport] ?? { bg: "#94A3B8", label: court.sport, chip: "bg-[#F1F5F9] text-[#0F172A]" };
  const thumbnail = court.photos[0];

  return (
    <Link href={`/courts/${court._id}`} className="block group">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-[0_1px_3px_0_rgb(0_0_0/0.1)] transition-all duration-200 group-hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.12)] group-hover:-translate-y-0.5">
        {/* Thumbnail */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={court.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: sport.bg }}
            >
              <svg className="w-12 h-12 text-white/40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
          )}
          {/* Sport chip overlay */}
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${sport.chip}`}>
            {sport.label}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-black text-[#0F172A] text-base leading-tight line-clamp-1">
              {court.name}
            </h3>
            <div className="flex items-center gap-1 text-[#737373]">
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs">{court.city}</span>
            </div>
          </div>

          <StarRating rating={court.averageRating} count={court.reviewCount} />

          <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-[#E84C1F]">
                ₱{court.pricePerHour.toLocaleString()}
              </span>
              <span className="text-xs text-[#A3A3A3]">/ hr</span>
            </div>
            <span className="text-xs font-semibold text-[#E84C1F] group-hover:underline">
              View Court →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
