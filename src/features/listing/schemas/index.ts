import { z } from "zod";
import { SportType } from "../constants";

export const METRO_MANILA_CITIES = [
  "Caloocan",
  "Las Piñas",
  "Makati",
  "Malabon",
  "Mandaluyong",
  "Manila",
  "Marikina",
  "Muntinlupa",
  "Navotas",
  "Parañaque",
  "Pasay",
  "Pasig",
  "Pateros",
  "Quezon City",
  "San Juan",
  "Taguig",
  "Valenzuela",
] as const;

export type MetroManilaCity = (typeof METRO_MANILA_CITIES)[number];

const operatingDaySchema = z.object({
  isOpen: z.boolean(),
  openingTime: z.string(),
  closingTime: z.string(),
});

export const listingFormSchema = z
  .object({
    name: z.string().min(3, "Court name must be at least 3 characters").max(100, "Court name must be under 100 characters"),
    sport: z.nativeEnum(SportType, { error: "Select a valid sport" }),
    city: z.enum(METRO_MANILA_CITIES, { error: "Select a valid Metro Manila city" }),
    pricePerHour: z
      .number({ error: "Price is required" })
      .positive("Price must be greater than 0")
      .max(50000, "Price must be under ₱50,000"),
    description: z.string().max(1000, "Description must be under 1,000 characters").optional(),
    fullAddress: z.object({
      line1: z.string().min(5, "Street address must be at least 5 characters"),
      line2: z.string().optional(),
      barangay: z.string().min(2, "Barangay is required"),
      postalCode: z.string().regex(/^\d{4}$/, "Postal code must be 4 digits"),
      province: z.string(),
      region: z.string(),
    }),
    operatingHours: z.record(
      z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]),
      operatingDaySchema
    ),
  })
  .refine(
    (data) => Object.values(data.operatingHours).some((d) => d.isOpen),
    { message: "At least one day must be open", path: ["operatingHours"] }
  )
  .refine(
    (data) =>
      Object.values(data.operatingHours).every(
        (d) => !d.isOpen || (d.openingTime && d.closingTime && d.closingTime > d.openingTime)
      ),
    { message: "Closing time must be after opening time for all open days", path: ["operatingHours"] }
  );

export type ListingFormData = z.infer<typeof listingFormSchema>;
