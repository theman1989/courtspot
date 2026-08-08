import type { CourtReview } from "@/types";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? "text-[#F59E0B]" : "text-[#E2E8F0]"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function relativeTime(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

export default function ReviewsList({
  reviews,
  averageRating,
  reviewCount,
}: {
  reviews: CourtReview[];
  averageRating: number;
  reviewCount: number;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-[#0F172A]">Reviews</h2>
        {reviewCount > 0 && (
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#F59E0B]" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-bold text-[#0F172A] text-sm">{averageRating.toFixed(1)}</span>
            <span className="text-[#A3A3A3] text-sm">
              ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-[#A3A3A3] text-center py-8">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div key={review._id} className="space-y-2 pb-5 border-b border-[#F1F5F9] last:border-0 last:pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#E84C1F] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {review.reviewerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A] leading-tight">{review.reviewerName}</p>
                    <p className="text-xs text-[#A3A3A3]">{relativeTime(review.createdAt)}</p>
                  </div>
                </div>
                <Stars rating={review.rating} />
              </div>
              {review.note && (
                <p className="text-sm text-[#525252] leading-relaxed pl-[42px]">{review.note}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
