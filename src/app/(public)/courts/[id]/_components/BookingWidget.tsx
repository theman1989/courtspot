"use client";

import { useState, useTransition } from "react";
import { bookCourt } from "@/features/booking/actions";

type OperatingHours = Record<string, { openingTime: string; closingTime: string }>;

const DOW_TO_KEY = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function generateSlots(openingTime: string, closingTime: string): string[] {
  const startH = parseInt(openingTime.split(":")[0]);
  const endH = parseInt(closingTime.split(":")[0]);
  const slots: string[] = [];
  for (let h = startH; h < endH; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
  }
  return slots;
}

function formatSlot(t: string): string {
  const h = parseInt(t.split(":")[0]);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12} ${ampm}`;
}

function nextHour(slot: string): string {
  const h = parseInt(slot.split(":")[0]);
  return `${String(h + 1).padStart(2, "0")}:00`;
}

function slotHour(slot: string): number {
  return parseInt(slot.split(":")[0]);
}

export default function BookingWidget({
  courtId,
  pricePerHour,
  operatingHours,
  userId,
}: {
  courtId: string;
  pricePerHour: number;
  operatingHours: OperatingHours;
  userId: string | null;
}) {
  const todayStr = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(todayStr);
  const [startSlot, setStartSlot] = useState<string | null>(null);
  const [endSlot, setEndSlot] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [bookingError, setBookingError] = useState<string | null>(null);

  const dayKey = DOW_TO_KEY[new Date(`${date}T00:00:00`).getDay()];
  const dayHours = operatingHours[dayKey];
  const slots = dayHours ? generateSlots(dayHours.openingTime, dayHours.closingTime) : [];

  const hours = startSlot && endSlot ? slotHour(endSlot) - slotHour(startSlot) + 1 : 0;
  const totalPrice = hours * pricePerHour;
  const endTime = endSlot ? nextHour(endSlot) : null;

  function handleSlotClick(slot: string) {
    if (!startSlot) {
      setStartSlot(slot);
      setEndSlot(null);
      return;
    }
    if (!endSlot) {
      if (slot === startSlot) {
        setEndSlot(slot);
        return;
      }
      if (slot < startSlot) {
        setStartSlot(slot);
        return;
      }
      setEndSlot(slot);
      return;
    }
    setStartSlot(slot);
    setEndSlot(null);
  }

  function slotState(slot: string): "selected" | "inrange" | "disabled" | "idle" {
    if (slot === startSlot || slot === endSlot) return "selected";
    if (startSlot && endSlot && slot > startSlot && slot < endSlot) return "inrange";
    if (startSlot && !endSlot && slot < startSlot) return "disabled";
    return "idle";
  }

  function handleBook() {
    if (!startSlot || !endSlot || !endTime) return;
    setBookingError(null);
    startTransition(async () => {
      const result = await bookCourt({
        courtListingId: courtId,
        date,
        startTime: startSlot,
        endTime,
        totalPrice,
      });
      if (result && !result.success) {
        setBookingError(result.error);
      }
    });
  }

  const canBook = !!startSlot && !!endSlot && hours > 0;
  const selectionLabel = !startSlot
    ? "Pick a start time"
    : !endSlot
    ? "Pick an end time"
    : `${formatSlot(startSlot)} – ${formatSlot(endTime!)}`;

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-5 shadow-[0_1px_3px_0_rgb(0_0_0/0.1)]">
      <div>
        <span className="text-2xl font-black text-[#E84C1F]">₱{pricePerHour.toLocaleString()}</span>
        <span className="text-sm text-[#A3A3A3] ml-1">/ hour</span>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[#525252] uppercase tracking-wider">Date</label>
        <input
          type="date"
          value={date}
          min={todayStr}
          onChange={(e) => {
            setDate(e.target.value);
            setStartSlot(null);
            setEndSlot(null);
          }}
          className="w-full h-10 px-3 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#E84C1F]/30 focus:border-[#E84C1F] transition-colors"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[#525252] uppercase tracking-wider">Time</label>
          <span className="text-xs text-[#A3A3A3]">{selectionLabel}</span>
        </div>

        {slots.length === 0 ? (
          <p className="text-sm text-[#A3A3A3] text-center py-4 bg-[#F8FAFC] rounded-xl">
            Closed on this day
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-1.5">
            {slots.map((slot) => {
              const state = slotState(slot);
              return (
                <button
                  key={slot}
                  onClick={() => handleSlotClick(slot)}
                  disabled={state === "disabled"}
                  className={`h-9 rounded-lg text-xs font-semibold transition-colors ${
                    state === "selected"
                      ? "bg-[#E84C1F] text-white shadow-[0_4px_10px_0_rgb(232_76_31/0.25)]"
                      : state === "inrange"
                      ? "bg-[#FEF0EC] text-[#E84C1F]"
                      : state === "disabled"
                      ? "bg-[#F8FAFC] text-[#CBD5E1] cursor-not-allowed"
                      : "bg-[#F8FAFC] text-[#525252] hover:bg-[#F1F5F9]"
                  }`}
                >
                  {formatSlot(slot)}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {canBook && (
        <div className="bg-[#F8FAFC] rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between text-[#737373]">
            <span>₱{pricePerHour.toLocaleString()} × {hours} hr{hours !== 1 ? "s" : ""}</span>
            <span>₱{totalPrice.toLocaleString()}</span>
          </div>
          <div className="h-px bg-[#E2E8F0]" />
          <div className="flex justify-between font-black text-[#0F172A]">
            <span>Total</span>
            <span>₱{totalPrice.toLocaleString()}</span>
          </div>
        </div>
      )}

      {userId ? (
        <button
          onClick={handleBook}
          disabled={!canBook || isPending}
          className="w-full h-12 rounded-xl bg-[#E84C1F] text-white font-bold text-sm shadow-[0_4px_14px_0_rgb(232_76_31/0.3)] hover:bg-[#C93E18] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Booking…" : "Book Now"}
        </button>
      ) : (
        <a
          href={`/login?callbackUrl=/courts/${courtId}`}
          className="w-full h-12 rounded-xl bg-[#E84C1F] text-white font-bold text-sm shadow-[0_4px_14px_0_rgb(232_76_31/0.3)] hover:bg-[#C93E18] transition-colors flex items-center justify-center"
        >
          Sign In to Book
        </a>
      )}

      {bookingError && (
        <p className="text-xs text-error text-center">{bookingError}</p>
      )}

      <p className="text-xs text-[#A3A3A3] text-center">No charges until booking is confirmed</p>
    </div>
  );
}
