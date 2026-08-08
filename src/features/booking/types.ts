export type BookingWithCourt = {
  _id: string;
  courtListingId: {
    _id: string;
    name: string;
    sport: string;
    city: string;
  } | null;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "completed" | "failed";
  hasReview: boolean;
};

export type OwnerDashboardBooking = {
  _id: string;
  courtName: string;
  bookerName: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
};

export type OwnerEarningsStats = {
  totalBookings: number;
  totalRevenue: number;
};
