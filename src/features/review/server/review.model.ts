import {
  model,
  models,
  Schema
} from 'mongoose';

const reviewSchema = new Schema({
  bookingId: {
    type: Schema.ObjectId,
    ref: 'Booking',
    required: true
  },
  bookerId: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  courtListingId: {
    type: Schema.ObjectId,
    ref: 'CourtListing',
    required: true
  },
  rating: {
    type: Number, // 1 - 5
    min: 1,
    max: 5,
    required: true
  },
  note: {
    type: String,
    default: null
  }
}, {
  timestamps: true
})

reviewSchema.index({ bookingId: 1 }, { unique: true });

export const Review = models.Review || model("Review", reviewSchema);