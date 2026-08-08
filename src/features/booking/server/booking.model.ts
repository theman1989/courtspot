import {
  model,
  models,
  Schema
} from 'mongoose';

const bookingSchema = new Schema({
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
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  }, // "08:00"
  endTime: {
    type: String,
    required: true,
  }, // "22:00"
  totalPrice: {
    type: Number,
    default: 0,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'failed'],
    default: 'pending',
    required: true
  },
  paymentRefId: {
    type: String,
  },
  attachments: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
})

bookingSchema.index({ courtListingId: 1, date: 1, startTime: 1, endTime: 1 });

export const Booking = models.Booking || model("Booking", bookingSchema);