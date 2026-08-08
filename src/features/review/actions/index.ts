"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/shared/libs/mongodb";
import { Review } from "../server/review.model";
import { Booking } from "@/features/booking/server/booking.model";

export async function submitReviewAction(data: {
  bookingId: string;
  rating: number;
  note?: string;
}): Promise<{ error: string } | undefined> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  await connectDB();

  const booking = await Booking.findOne({
    _id: data.bookingId,
    bookerId: session.user.id,
    status: "completed",
  });

  if (!booking) {
    return { error: "Booking not found or not completed" };
  }

  try {
    await Review.create({
      bookingId: data.bookingId,
      bookerId: session.user.id,
      courtListingId: booking.courtListingId,
      rating: data.rating,
      note: data.note ?? null,
    });
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: unknown }).code === 11000
    ) {
      return { error: "You've already reviewed this booking" };
    }
    return { error: "Something went wrong. Please try again." };
  }

  revalidatePath("/dashboard");
}
