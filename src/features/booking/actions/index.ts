"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { createBooking } from "../server/booking.service";

export async function bookCourt(payload: {
  courtListingId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
}): Promise<{ success: false; error: string } | void> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/courts/${payload.courtListingId}`);
  }

  const result = await createBooking({
    bookerId: session.user.id,
    ...payload,
  });

  if (!result.success) return result;

  redirect(`/bookings/${result.bookingId}/confirmation`);
}
