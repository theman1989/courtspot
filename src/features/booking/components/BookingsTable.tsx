"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { submitReviewAction } from "@/features/review/actions";
import type { BookingWithCourt } from "@/features/booking/types";

type BadgeVariantType = "success" | "warning" | "info" | "error" | "default";

const STATUS_CONFIG: Record<string, { variant: BadgeVariantType; label: string }> = {
  confirmed: { variant: "success", label: "Confirmed" },
  completed: { variant: "info", label: "Completed" },
  pending: { variant: "warning", label: "Pending" },
  failed: { variant: "error", label: "Failed" },
};

const SPORT_VARIANT: Record<string, string> = {
  basketball: "basketball",
  tennis: "tennis",
  badminton: "badminton",
  futsal: "soccer",
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

export default function BookingsTable({ bookings }: { bookings: BookingWithCourt[] }) {
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const reviewingBooking = bookings.find((b) => b._id === reviewingId) ?? null;

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center space-y-3">
        <p className="text-[#0F172A] font-bold text-lg">No bookings yet</p>
        <p className="text-[#737373] text-sm">
          When you book a court, it&apos;ll show up here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                {(["Court", "Date", "Time", "Status", "Amount", "Action"] as const).map(
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
                const court = booking.courtListingId;
                const statusCfg = STATUS_CONFIG[booking.status] ?? {
                  variant: "default" as BadgeVariantType,
                  label: booking.status,
                };
                const sportVariant = court
                  ? (SPORT_VARIANT[court.sport] ?? "default")
                  : "default";

                return (
                  <tr key={booking._id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <p className="font-semibold text-[#0F172A]">{court?.name ?? "—"}</p>
                        {court && (
                          <div className="flex items-center gap-1.5">
                            <Badge variant={sportVariant as any} size="sm">
                              {court.sport}
                            </Badge>
                            <span className="text-[#A3A3A3] text-xs">{court.city}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#525252]">{formatDate(booking.date)}</td>
                    <td className="px-5 py-4 text-[#525252] whitespace-nowrap">
                      {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={statusCfg.variant} dot size="sm">
                        {statusCfg.label}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right font-black text-[#E84C1F]">
                      ₱{booking.totalPrice.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {booking.status === "completed" && !booking.hasReview && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setReviewingId(booking._id)}
                        >
                          Leave Review
                        </Button>
                      )}
                      {booking.status === "completed" && booking.hasReview && (
                        <span className="text-xs text-[#A3A3A3] font-medium">Reviewed ✓</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {reviewingBooking && (
        <ReviewModal
          booking={reviewingBooking}
          onClose={() => setReviewingId(null)}
        />
      )}
    </>
  );
}

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="text-2xl transition-transform hover:scale-110 focus:outline-none"
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          <span className={active >= star ? "text-[#E84C1F]" : "text-[#E2E8F0]"}>★</span>
        </button>
      ))}
    </div>
  );
}

function ReviewModal({
  booking,
  onClose,
}: {
  booking: BookingWithCourt;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    startTransition(async () => {
      const result = await submitReviewAction({
        bookingId: booking._id,
        rating,
        note: note.trim() || undefined,
      });
      if (result?.error) {
        setError(result.error);
        return;
      }
      onClose();
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-black text-[#0F172A] text-lg">Leave a Review</h3>
            <p className="text-[#737373] text-sm mt-0.5">
              {booking.courtListingId?.name ?? "—"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#A3A3A3] hover:text-[#0F172A] transition-colors p-1 rounded-md"
            aria-label="Close"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#0F172A]">Rating</label>
          <StarPicker value={rating} onChange={setRating} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#0F172A]">
            Comment <span className="text-[#A3A3A3] font-normal">(optional)</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="How was your experience?"
            rows={3}
            className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#E84C1F]/30 focus:border-[#E84C1F] resize-none transition-colors"
          />
        </div>

        {error && <p className="text-sm text-[#DC2626]">{error}</p>}

        <div className="flex gap-2 pt-1">
          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            fullWidth
            loading={isPending}
            onClick={handleSubmit}
          >
            Submit Review
          </Button>
        </div>
      </div>
    </div>
  );
}
