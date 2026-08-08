"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import {
  createCourtListing,
  deleteOwnerListing,
  updateCourtListing,
} from "@/features/listing/server/courtListing.service";
import { listingFormSchema, type ListingFormData } from "@/features/listing/schemas";
import { CourtListingStatus } from "@/features/listing/constants";

export async function deleteListingAction(
  listingId: string
): Promise<{ success: true } | { error: string }> {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Unauthorized" };
  if (!session.user.role.includes("owner")) return { error: "Forbidden" };

  const result = await deleteOwnerListing(session.user.id, listingId);
  if (!result.success) return { error: result.error ?? "Failed to delete listing." };

  revalidatePath("/owner/dashboard");
  return { success: true };
}

function buildOperatingHoursPayload(
  formHours: ListingFormData["operatingHours"]
): Record<string, { openingTime: string; closingTime: string }> {
  const result: Record<string, { openingTime: string; closingTime: string }> = {};
  for (const [day, value] of Object.entries(formHours)) {
    if (value.isOpen) {
      result[day] = { openingTime: value.openingTime, closingTime: value.closingTime };
    }
  }
  return result;
}

export async function createListingAction(
  data: ListingFormData
): Promise<{ error: string } | void> {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Unauthorized" };
  if (!session.user.role.includes("owner")) return { error: "Forbidden" };

  const parsed = listingFormSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid form data." };

  const { fullAddress, operatingHours, ...rest } = parsed.data;

  await createCourtListing({
    ...rest,
    fullAddress: {
      ...fullAddress,
      city: rest.city,
      country: "Philippines",
    },
    operatingHours: buildOperatingHoursPayload(operatingHours),
    ownerId: session.user.id,
    photos: [],
    averageRating: 0,
    reviewCount: 0,
    status: CourtListingStatus.ACTIVE,
  } as any);

  revalidatePath("/owner/dashboard");
  redirect("/owner/dashboard?tab=listings");
}

export async function updateListingAction(
  listingId: string,
  data: ListingFormData
): Promise<{ error: string } | void> {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Unauthorized" };
  if (!session.user.role.includes("owner")) return { error: "Forbidden" };

  const parsed = listingFormSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid form data." };

  const { fullAddress, operatingHours, ...rest } = parsed.data;

  const result = await updateCourtListing(session.user.id, listingId, {
    ...rest,
    fullAddress: {
      ...fullAddress,
      city: rest.city,
      country: "Philippines",
    },
    operatingHours: buildOperatingHoursPayload(operatingHours),
  });

  if (!result.success) return { error: result.error ?? "Failed to update listing." };

  revalidatePath("/owner/dashboard");
  redirect("/owner/dashboard?tab=listings");
}
