import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/auth";
import { getCourtDetail } from "@/features/listing";
import CourtGallery from "./_components/CourtGallery";
import OperatingHours from "./_components/OperatingHours";
import ReviewsList from "./_components/ReviewsList";
import BookingWidget from "./_components/BookingWidget";

const SPORT_META: Record<string, { label: string; bg: string; chip: string }> = {
  basketball: { label: "Basketball", bg: "#FF6B35", chip: "bg-[#FFF1EB] text-[#FF6B35]" },
  badminton: { label: "Badminton", bg: "#818CF8", chip: "bg-[#EEF2FF] text-[#6366F1]" },
  tennis: { label: "Tennis", bg: "#84CC16", chip: "bg-[#F0FBE4] text-[#65A30D]" },
  futsal: { label: "Futsal", bg: "#22C55E", chip: "bg-[#DCFCE7] text-[#16A34A]" },
  pickleball: { label: "Pickleball", bg: "#F59E0B", chip: "bg-[#FFFBEB] text-[#D97706]" },
};

type Params = Promise<{ id: string }>;

export default async function CourtDetailPage({ params }: { params: Params }) {
  const { id } = await params;

  const [result, session] = await Promise.all([
    getCourtDetail(id),
    getServerSession(authOptions),
  ]);

  if (!result) notFound();

  const { court, reviews } = result;

  const userId = session?.user?.id ?? null;
  const sport = SPORT_META[court.sport] ?? { label: court.sport, bg: "#94A3B8", chip: "bg-[#F1F5F9] text-[#525252]" };

  const addr = court.fullAddress;
  const addressParts = [addr.line1, addr.line2, addr.barangay, addr.city, addr.province]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#737373]">
        <Link href="/courts" className="hover:text-[#0F172A] transition-colors">
          Browse Courts
        </Link>
        <span>/</span>
        <span className="text-[#0F172A] font-medium truncate">{court.name}</span>
      </nav>

      {/* Gallery */}
      <CourtGallery photos={court.photos} sportBg={sport.bg} />

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Left: main content */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Core info */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5 min-w-0">
                <h1 className="text-2xl font-black text-[#0F172A] leading-tight">{court.name}</h1>
                <div className="flex items-center gap-1.5 text-[#737373]">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{addressParts}</span>
                </div>
              </div>
              <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${sport.chip}`}>
                {sport.label}
              </span>
            </div>

            <div className="h-px bg-[#F1F5F9]" />

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#F59E0B]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-bold text-[#0F172A] text-sm">
                  {court.averageRating > 0 ? court.averageRating.toFixed(1) : "No ratings yet"}
                </span>
                {court.reviewCount > 0 && (
                  <span className="text-[#A3A3A3] text-sm">
                    ({court.reviewCount} review{court.reviewCount !== 1 ? "s" : ""})
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-[#E84C1F]">
                  ₱{court.pricePerHour.toLocaleString()}
                </span>
                <span className="text-sm text-[#A3A3A3]">/ hr</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {court.description && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-3">
              <h2 className="text-lg font-black text-[#0F172A]">About this court</h2>
              <p className="text-sm text-[#525252] leading-relaxed whitespace-pre-line">
                {court.description}
              </p>
            </div>
          )}

          {/* Operating hours */}
          <OperatingHours operatingHours={court.operatingHours} />

          {/* Reviews */}
          <ReviewsList
            reviews={reviews}
            averageRating={court.averageRating}
            reviewCount={court.reviewCount}
          />
        </div>

        {/* Right: sticky booking widget */}
        <div className="w-full lg:w-80 xl:w-96 shrink-0">
          <div className="sticky top-24">
            <BookingWidget
              courtId={court._id}
              pricePerHour={court.pricePerHour}
              operatingHours={court.operatingHours}
              userId={userId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
