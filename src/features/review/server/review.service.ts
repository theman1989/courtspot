import { connectDB } from "@/shared/libs/mongodb";
import type { CourtReview } from "@/types";
import { Review as CourtReviewModel } from '../server/review.model';


async function createCourtReview() {
  await connectDB();

}

async function getReviewsByCourtId(id: string): Promise<CourtReview[]> {
  await connectDB();

  const rawReviews = await CourtReviewModel.find({ courtListingId: id })
    .populate("bookerId", "name")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const reviews: CourtReview[] = (rawReviews as any[]).map((r) => ({
    _id: r._id.toString(),
    rating: r.rating,
    note: r.note ?? null,
    reviewerName: (r.bookerId as any)?.name ?? "Anonymous",
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
  }));

  return reviews;

}

async function getReviewedBookingIds(bookerId: string): Promise<string[]> {
  await connectDB();

  const reviews = await CourtReviewModel.find({ bookerId }).select("bookingId").lean();

  return (reviews as { bookingId: { toString(): string } }[]).map((r) =>
    r.bookingId.toString()
  );
}

export {
  createCourtReview,
  getReviewsByCourtId,
  getReviewedBookingIds,
}