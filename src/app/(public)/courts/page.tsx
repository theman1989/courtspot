import Link from "next/link";
import { browseCourts } from "@/features/listing";
import CourtCard from "./_components/CourtCard";
import CourtFilters from "./_components/CourtFilters";
import { Suspense } from "react";

const PRICE_MAP: Record<string, { minPrice?: number; maxPrice?: number }> = {
  "under-300": { maxPrice: 300 },
  "300-500": { minPrice: 300, maxPrice: 500 },
  "500-700": { minPrice: 500, maxPrice: 700 },
  "700-plus": { minPrice: 700 },
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function BrowseCourtsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;

  const sport = typeof sp.sport === "string" ? sp.sport : "";
  const city = typeof sp.city === "string" ? sp.city : "";
  const priceRange = typeof sp.price === "string" ? sp.price : "";
  const page = Math.max(1, parseInt(typeof sp.page === "string" ? sp.page : "1", 10) || 1);

  const { minPrice, maxPrice } = PRICE_MAP[priceRange] ?? {};

  const { courts, totalPages, total } = await browseCourts({
    sport: sport || undefined,
    city: city || undefined,
    minPrice,
    maxPrice,
    page,
    limit: 12,
  });

  const hasFilters = sport || city || priceRange;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Browse Courts</h1>
        <p className="text-[#737373] text-sm">
          {total === 0
            ? "No courts match your filters"
            : `${total} court${total === 1 ? "" : "s"} available in Metro Manila`}
        </p>
      </div>

      {/* Filters */}
      <Suspense>
        <CourtFilters sport={sport} city={city} priceRange={priceRange} />
      </Suspense>

      {/* Results */}
      {courts.length === 0 ? (
        <EmptyState hasFilters={!!hasFilters} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courts.map((court) => (
              <CourtCard key={court._id} court={court} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} sport={sport} city={city} priceRange={priceRange} />
          )}
        </>
      )}
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#F1F5F9] flex items-center justify-center">
        <svg className="w-8 h-8 text-[#94A3B8]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      </div>
      <div className="space-y-1">
        <p className="font-bold text-[#0F172A]">No courts found</p>
        <p className="text-sm text-[#737373]">
          {hasFilters ? "Try adjusting or clearing your filters." : "Check back soon — more courts are being added."}
        </p>
      </div>
      {hasFilters && (
        <Link
          href="/courts"
          className="h-9 px-5 inline-flex items-center rounded-lg border border-[#E84C1F] text-[#E84C1F] text-sm font-semibold hover:bg-[#FEF0EC] transition-colors"
        >
          Clear filters
        </Link>
      )}
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  sport,
  city,
  priceRange,
}: {
  currentPage: number;
  totalPages: number;
  sport: string;
  city: string;
  priceRange: string;
}) {
  function pageHref(p: number) {
    const params = new URLSearchParams();
    if (sport) params.set("sport", sport);
    if (city) params.set("city", city);
    if (priceRange) params.set("price", priceRange);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/courts${qs ? `?${qs}` : ""}`;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      {currentPage > 1 && (
        <Link
          href={pageHref(currentPage - 1)}
          className="h-9 px-4 inline-flex items-center rounded-lg border border-[#E2E8F0] bg-white text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
        >
          ← Prev
        </Link>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={pageHref(p)}
          className={`h-9 w-9 inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${p === currentPage
            ? "bg-[#E84C1F] text-white shadow-[0_4px_10px_0_rgb(232_76_31/0.3)]"
            : "border border-[#E2E8F0] bg-white text-[#525252] hover:bg-[#F8FAFC]"
            }`}
        >
          {p}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={pageHref(currentPage + 1)}
          className="h-9 px-4 inline-flex items-center rounded-lg border border-[#E2E8F0] bg-white text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
        >
          Next →
        </Link>
      )}
    </div>
  );
}
