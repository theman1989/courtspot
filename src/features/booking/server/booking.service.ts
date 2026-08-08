import { connectDB } from "@/shared/libs/mongodb";
import { Booking } from "./booking.model";
import "@/features/listing/server/courtListing.model";
import "@/features/users/server/user.model";
import { getReviewedBookingIds } from "@/features/review";
import type { BookingWithCourt, OwnerDashboardBooking, OwnerEarningsStats } from "../types";
import { CourtListing as CourtListingModel } from "@/features/listing/server/courtListing.model";

export type CreateBookingPayload = {
  bookerId: string;
  courtListingId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
};

export async function createBooking(
  payload: CreateBookingPayload
): Promise<{ success: true; bookingId: string } | { success: false; error: string }> {
  await connectDB();

  const conflict = await Booking.findOne({
    courtListingId: payload.courtListingId,
    date: new Date(payload.date),
    status: { $in: ["pending", "confirmed"] },
    startTime: { $lt: payload.endTime },
    endTime: { $gt: payload.startTime },
  });

  if (conflict) {
    return { success: false, error: "This time slot is already booked." };
  }

  const booking = await Booking.create({
    bookerId: payload.bookerId,
    courtListingId: payload.courtListingId,
    date: new Date(payload.date),
    startTime: payload.startTime,
    endTime: payload.endTime,
    totalPrice: payload.totalPrice,
    status: "pending",
  });

  return { success: true, bookingId: booking._id.toString() };
}

export type BookingConfirmation = {
  _id: string;
  court: { name: string; city: string } | null;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
};

export async function getBookingById(
  bookingId: string,
  bookerId: string
): Promise<BookingConfirmation | null> {
  await connectDB();

  const booking = await Booking.findOne({ _id: bookingId, bookerId })
    .populate("courtListingId", "name city")
    .lean();

  if (!booking) return null;

  const b = booking as any;
  const court = b.courtListingId;

  return {
    _id: b._id.toString(),
    court: court ? { name: court.name, city: court.city } : null,
    date: b.date instanceof Date ? b.date.toISOString() : String(b.date),
    startTime: b.startTime,
    endTime: b.endTime,
    totalPrice: b.totalPrice,
    status: b.status,
  };
}

export type DashboardStats = {
  totalBookings: number;
  totalHours: number;
  distinctCourts: number;
};

export async function getBookerDashboardData(bookerId: string): Promise<{
  bookings: BookingWithCourt[];
  stats: DashboardStats;
}> {
  await connectDB();

  const [rawBookings, reviewedBookingIds] = await Promise.all([
    Booking.find({ bookerId })
      .populate("courtListingId", "name sport city")
      .sort({ date: -1, startTime: -1 })
      .limit(50)
      .lean(),
    getReviewedBookingIds(bookerId),
  ]);

  const reviewedIds = new Set(reviewedBookingIds);

  const bookings: BookingWithCourt[] = (rawBookings as any[]).map((b) => {
    const court = b.courtListingId as
      | { _id: { toString(): string }; name: string; sport: string; city: string }
      | null;

    return {
      _id: b._id.toString(),
      courtListingId: court
        ? {
          _id: court._id.toString(),
          name: court.name,
          sport: court.sport,
          city: court.city,
        }
        : null,
      date: b.date instanceof Date ? b.date.toISOString() : String(b.date),
      startTime: b.startTime,
      endTime: b.endTime,
      totalPrice: b.totalPrice,
      status: b.status,
      hasReview: reviewedIds.has(b._id.toString()),
    };
  });

  const activeBookings = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "completed"
  );

  const totalHours = activeBookings.reduce((sum, b) => {
    const [sh, sm] = b.startTime.split(":").map(Number);
    const [eh, em] = b.endTime.split(":").map(Number);
    return sum + (eh + em / 60) - (sh + sm / 60);
  }, 0);

  const distinctCourts = new Set(
    activeBookings
      .filter((b) => b.courtListingId)
      .map((b) => b.courtListingId!._id)
  ).size;

  return {
    bookings,
    stats: {
      totalBookings: bookings.length,
      totalHours: Math.round(totalHours),
      distinctCourts,
    },
  };
}

export async function getOwnerDashboardBookings(ownerId: string): Promise<OwnerDashboardBooking[]> {
  await connectDB();

  const courts = await CourtListingModel.find({ ownerId }).select("_id").lean();
  const courtIds = (courts as any[]).map((c) => c._id);

  if (courtIds.length === 0) return [];

  const raw = await Booking.find({ courtListingId: { $in: courtIds } })
    .populate("courtListingId", "name")
    .populate("bookerId", "name")
    .sort({ date: -1, startTime: -1 })
    .limit(100)
    .lean();

  return (raw as any[]).map((b) => ({
    _id: b._id.toString(),
    courtName: b.courtListingId?.name ?? "—",
    bookerName: b.bookerId?.name ?? "Unknown",
    date: b.date instanceof Date ? b.date.toISOString() : String(b.date),
    startTime: b.startTime,
    endTime: b.endTime,
    totalPrice: b.totalPrice,
    status: b.status,
  }));
}

export async function getOwnerEarningsStats(ownerId: string): Promise<OwnerEarningsStats> {
  await connectDB();

  const courts = await CourtListingModel.find({ ownerId }).select("_id").lean();
  const courtIds = (courts as any[]).map((c) => c._id);

  if (courtIds.length === 0) return { totalBookings: 0, totalRevenue: 0 };

  const bookings = await Booking.find({
    courtListingId: { $in: courtIds },
    status: { $in: ["confirmed", "completed"] },
  })
    .select("totalPrice")
    .lean();

  const totalRevenue = (bookings as any[]).reduce((sum, b) => sum + b.totalPrice, 0);

  return { totalBookings: bookings.length, totalRevenue };
}
