import { CourtListingStatus, SportType } from "./constants";

export type Address = {
  line1: string;
  line2?: string;
  barangay: string;
  city: string;
  province: string;
  region: string;
  postalCode: string;
  country: string;
};

export type CourtListing = {
  _id: string;
  ownerId: string;
  name: string;
  sport: SportType;
  city: string;
  fullAddress: Address;
  pricePerHour: number;
  operatingHours: Record<string, { openingTime: string; closingTime: string }>;
  description?: string;
  photos: string[];
  averageRating: number;
  reviewCount: number;
  status: CourtListingStatus;
};

export type BrowseCourtListing = {
  _id: string;
  name: string;
  sport: string;
  city: string;
  pricePerHour: number;
  averageRating: number;
  reviewCount: number;
  photos: string[];
};

export type OwnerDashboardListing = {
  _id: string;
  name: string;
  sport: string;
  city: string;
  pricePerHour: number;
  averageRating: number;
  reviewCount: number;
  status: string;
};

export type ListingForEdit = {
  _id: string;
  name: string;
  sport: SportType;
  city: string;
  fullAddress: Address;
  pricePerHour: number;
  operatingHours: Record<string, { openingTime: string; closingTime: string }>;
  description?: string;
  status: CourtListingStatus;
};
