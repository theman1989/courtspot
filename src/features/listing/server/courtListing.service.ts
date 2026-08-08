import { connectDB } from "@/shared/libs/mongodb";
import { CourtListing, BrowseCourtListing } from "../types";
import type { CourtReview } from "@/types";

import { CourtListing as CourtListingModel } from "./courtListing.model";
import { CourtListingStatus } from "../constants";
import "@/features/users";
import { getReviewsByCourtId } from "@/features/review";

type BrowseFilters = {
  sport?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
};

type BrowseResult = {
  courts: BrowseCourtListing[];
  page: number;
  totalPages: number;
  total: number;
};

async function createCourtListing(payload: CourtListing) {
  await connectDB();
  return CourtListingModel.create(payload);
}

async function browseCourts(filters: BrowseFilters): Promise<BrowseResult> {
  await connectDB();

  const {
    sport,
    city,
    minPrice,
    maxPrice,
    page = 1,
    limit = 12
  } = filters;

  const query: Record<string, unknown> = { status: CourtListingStatus.ACTIVE };
  if (sport) query.sport = sport;
  if (city) query.city = city;
  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceFilter: Record<string, number> = {};
    if (minPrice !== undefined) priceFilter.$gte = minPrice;
    if (maxPrice !== undefined) priceFilter.$lte = maxPrice;
    query.pricePerHour = priceFilter;
  }

  const skip = (page - 1) * limit;

  const [raw, total] = await Promise.all([
    CourtListingModel.find(query)
      .sort({ averageRating: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    CourtListingModel.countDocuments(query),
  ]);

  const courts: BrowseCourtListing[] = (raw as any[]).map((c) => ({
    _id: c._id.toString(),
    name: c.name,
    sport: c.sport,
    city: c.city,
    pricePerHour: c.pricePerHour,
    averageRating: c.averageRating ?? 0,
    reviewCount: c.reviewCount ?? 0,
    photos: (c.photos ?? []) as string[],
  }));

  return { courts, page, totalPages: Math.ceil(total / limit), total };
}

async function getCourtDetail(id: string): Promise<{ court: CourtListing; reviews: CourtReview[] } | null> {
  await connectDB();

  const raw = await CourtListingModel.findOne({ _id: id, status: CourtListingStatus.ACTIVE }).lean();
  if (!raw) return null;

  const c = raw as any;

  const rawOpHours = c.operatingHours;
  const operatingHours: Record<string, { openingTime: string; closingTime: string }> = {};
  if (rawOpHours) {
    const entries = rawOpHours instanceof Map
      ? Array.from(rawOpHours.entries())
      : Object.entries(rawOpHours);
    for (const [day, hours] of entries as [string, { openingTime: string; closingTime: string }][]) {
      operatingHours[day] = hours;
    }
  }

  const reviews = await getReviewsByCourtId(id);

  return {
    court: {
      _id: c._id.toString(),
      ownerId: c.ownerId.toString(),
      name: c.name,
      sport: c.sport,
      city: c.city,
      fullAddress: c.fullAddress,
      pricePerHour: c.pricePerHour,
      operatingHours,
      description: c.description,
      photos: (c.photos ?? []) as string[],
      averageRating: c.averageRating ?? 0,
      reviewCount: c.reviewCount ?? 0,
      status: c.status
    },
    reviews,
  };
}

async function getOwnerDashboardListings(ownerId: string): Promise<import("../types").OwnerDashboardListing[]> {
  await connectDB();

  const raw = await CourtListingModel.find({ ownerId }).sort({ createdAt: -1 }).lean();

  return (raw as any[]).map((c) => ({
    _id: c._id.toString(),
    name: c.name,
    sport: c.sport,
    city: c.city,
    pricePerHour: c.pricePerHour,
    averageRating: c.averageRating ?? 0,
    reviewCount: c.reviewCount ?? 0,
    status: c.status,
  }));
}

async function deleteOwnerListing(
  ownerId: string,
  listingId: string
): Promise<{ success: boolean; error?: string }> {
  await connectDB();

  const listing = await CourtListingModel.findOne({ _id: listingId, ownerId });
  if (!listing) return { success: false, error: "Listing not found or unauthorized." };

  await CourtListingModel.updateOne({ _id: listingId }, { status: CourtListingStatus.ARCHIVED });

  return { success: true };
}

async function getListingForEdit(
  ownerId: string,
  listingId: string
): Promise<import("../types").ListingForEdit | null> {
  await connectDB();

  const raw = await CourtListingModel.findOne({ _id: listingId, ownerId }).lean();
  if (!raw) return null;

  const c = raw as any;

  const rawOpHours = c.operatingHours;
  const operatingHours: Record<string, { openingTime: string; closingTime: string }> = {};
  if (rawOpHours) {
    const entries =
      rawOpHours instanceof Map
        ? Array.from(rawOpHours.entries())
        : Object.entries(rawOpHours);
    for (const [day, hours] of entries as [string, { openingTime: string; closingTime: string }][]) {
      operatingHours[day] = hours;
    }
  }

  return {
    _id: c._id.toString(),
    name: c.name,
    sport: c.sport,
    city: c.city,
    fullAddress: c.fullAddress,
    pricePerHour: c.pricePerHour,
    operatingHours,
    description: c.description,
    status: c.status,
  };
}

type UpdateListingPayload = {
  name: string;
  sport: string;
  city: string;
  fullAddress: {
    line1: string;
    line2?: string;
    barangay: string;
    city: string;
    postalCode: string;
    province: string;
    region: string;
    country: string;
  };
  pricePerHour: number;
  operatingHours: Record<string, { openingTime: string; closingTime: string }>;
  description?: string;
};

async function updateCourtListing(
  ownerId: string,
  listingId: string,
  payload: UpdateListingPayload
): Promise<{ success: boolean; error?: string }> {
  await connectDB();

  const listing = await CourtListingModel.findOne({ _id: listingId, ownerId });
  if (!listing) return { success: false, error: "Listing not found or unauthorized." };

  await CourtListingModel.updateOne({ _id: listingId }, { $set: payload });

  return { success: true };
}

export {
  createCourtListing,
  browseCourts,
  getCourtDetail,
  getOwnerDashboardListings,
  deleteOwnerListing,
  getListingForEdit,
  updateCourtListing,
}