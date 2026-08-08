import { model, models, Schema } from "mongoose";
import { Address } from "../types";
import { CourtListingStatus, SportType } from "../constants";


const addressSchema = new Schema<Address>({
  line1: { type: String, required: true },
  line2: String,
  barangay: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  region: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, default: "Philippines" },
});

const operatingHourSchema = new Schema(
  {
    openingTime: String,
    closingTime: String,
  },
  { _id: false }
);


const courtListingSchema = new Schema(
  {
    ownerId: {
      type: Schema.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    sport: {
      type: String,
      enum: SportType,
      default: SportType.BASKETBALL,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    fullAddress: {
      type: addressSchema,
      required: true
    },
    pricePerHour: {
      type: Number,
      required: true,
    },
    operatingHours: {
      type: Map,
      of: operatingHourSchema,
      required: true,
    },
    description: {
      type: String,
    },
    photos: {
      type: [String],
      default: []
    },
    averageRating: {
      type: Number,
      default: 0
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: CourtListingStatus,
      required: true,
      default: CourtListingStatus.PENDING_APPROVAL
    }
  },
  {
    timestamps: true,
  },
);

export const CourtListing = models.CourtListing || model("CourtListing", courtListingSchema);