"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Divider } from "@/shared/components/ui/Divider";
import { createListingAction, updateListingAction } from "@/features/listing/actions";
import {
  listingFormSchema,
  type ListingFormData,
  METRO_MANILA_CITIES,
} from "@/features/listing/schemas";
import { SportType } from "@/features/listing/constants";
import type { ListingForEdit } from "@/features/listing/types";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const DAY_LABELS: Record<(typeof DAYS)[number], string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const SPORT_LABELS: Record<SportType, string> = {
  [SportType.BASKETBALL]: "Basketball",
  [SportType.PICKLEBALL]: "Pickleball",
  [SportType.BADMINTON]: "Badminton",
  [SportType.TENNIS]: "Tennis",
  [SportType.FUTSAL]: "Futsal",
};

function buildDefaultOperatingHours(
  existing?: Record<string, { openingTime: string; closingTime: string }>
): ListingFormData["operatingHours"] {
  const result = {} as ListingFormData["operatingHours"];
  for (const day of DAYS) {
    const saved = existing?.[day];
    result[day] = saved
      ? { isOpen: true, openingTime: saved.openingTime, closingTime: saved.closingTime }
      : { isOpen: false, openingTime: "08:00", closingTime: "22:00" };
  }
  return result;
}

interface ListingFormProps {
  listing?: ListingForEdit;
}

export default function ListingForm({ listing }: ListingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEdit = !!listing;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      name: listing?.name ?? "",
      sport: listing?.sport ?? SportType.BASKETBALL,
      city: (listing?.city as ListingFormData["city"]) ?? undefined,
      pricePerHour: listing?.pricePerHour ?? undefined,
      description: listing?.description ?? "",
      fullAddress: {
        line1: listing?.fullAddress?.line1 ?? "",
        line2: listing?.fullAddress?.line2 ?? "",
        barangay: listing?.fullAddress?.barangay ?? "",
        postalCode: listing?.fullAddress?.postalCode ?? "",
        province: "Metro Manila",
        region: "NCR",
      },
      operatingHours: buildDefaultOperatingHours(listing?.operatingHours),
    },
  });

  const operatingHours = watch("operatingHours");

  const onSubmit = (data: ListingFormData) => {
    startTransition(async () => {
      const result = isEdit
        ? await updateListingAction(listing._id, data)
        : await createListingAction(data);

      if (result && "error" in result) {
        setError("root", { message: result.error });
      }
    });
  };

  const selectClass =
    "w-full rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] text-sm font-medium " +
    "h-11 px-3.5 transition-colors duration-150 focus:outline-none focus:ring-2 " +
    "focus:ring-[#E84C1F]/25 focus:border-[#E84C1F] disabled:opacity-50 disabled:cursor-not-allowed " +
    "disabled:bg-[#F5F5F5]";

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">

      {/* Basic Info */}
      <section className="space-y-5">
        <div>
          <h2 className="text-base font-bold text-[#0F172A]">Basic Info</h2>
          <p className="text-sm text-[#737373] mt-0.5">Core details that appear in search results.</p>
        </div>

        <Input
          label="Court Name"
          placeholder="e.g. Makati Sports Hub — Court A"
          error={errors.name?.message}
          required
          {...register("name")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="w-full">
            <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">
              Sport <span className="text-[#E84C1F]" aria-hidden="true">*</span>
            </label>
            <select className={selectClass} {...register("sport")}>
              {Object.values(SportType).map((s) => (
                <option key={s} value={s}>
                  {SPORT_LABELS[s]}
                </option>
              ))}
            </select>
            {errors.sport && (
              <p className="mt-1.5 text-xs font-medium text-[#DC2626]">{errors.sport.message}</p>
            )}
          </div>

          <div className="w-full">
            <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">
              City <span className="text-[#E84C1F]" aria-hidden="true">*</span>
            </label>
            <select className={selectClass} {...register("city")}>
              <option value="">Select city…</option>
              {METRO_MANILA_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="mt-1.5 text-xs font-medium text-[#DC2626]">{errors.city.message}</p>
            )}
          </div>
        </div>

        <Input
          label="Price per Hour (₱)"
          type="number"
          min={1}
          max={50000}
          placeholder="e.g. 500"
          error={errors.pricePerHour?.message}
          required
          leftAddon={<span className="text-sm font-semibold text-[#737373]">₱</span>}
          {...register("pricePerHour", { valueAsNumber: true })}
        />
      </section>

      <Divider />

      {/* Description */}
      <section className="space-y-5">
        <div>
          <h2 className="text-base font-bold text-[#0F172A]">Description</h2>
          <p className="text-sm text-[#737373] mt-0.5">Optional — appears on the court detail page.</p>
        </div>

        <div className="w-full">
          <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Description</label>
          <textarea
            rows={4}
            placeholder="Describe your court — facilities, amenities, parking, etc."
            className={[
              "w-full rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-[#A3A3A3]",
              "text-sm font-medium transition-colors duration-150 px-3.5 py-2.5 resize-y",
              "focus:outline-none focus:ring-2 focus:ring-[#E84C1F]/25 focus:border-[#E84C1F]",
              errors.description ? "border-[#DC2626]" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            {...register("description")}
          />
          {errors.description && (
            <p className="mt-1.5 text-xs font-medium text-[#DC2626]">{errors.description.message}</p>
          )}
        </div>
      </section>

      <Divider />

      {/* Address */}
      <section className="space-y-5">
        <div>
          <h2 className="text-base font-bold text-[#0F172A]">Address</h2>
          <p className="text-sm text-[#737373] mt-0.5">Full location of the court.</p>
        </div>

        <Input
          label="Street Address"
          placeholder="e.g. 123 Ayala Avenue"
          error={errors.fullAddress?.line1?.message}
          required
          {...register("fullAddress.line1")}
        />

        <Input
          label="Unit / Floor / Building"
          placeholder="e.g. Unit 4B, 2nd Floor (optional)"
          error={errors.fullAddress?.line2?.message}
          {...register("fullAddress.line2")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Barangay"
            placeholder="e.g. Bel-Air"
            error={errors.fullAddress?.barangay?.message}
            required
            {...register("fullAddress.barangay")}
          />

          <Input
            label="Postal Code"
            placeholder="e.g. 1226"
            maxLength={4}
            error={errors.fullAddress?.postalCode?.message}
            required
            {...register("fullAddress.postalCode")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="w-full">
            <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">City</label>
            <div className="h-11 px-3.5 flex items-center rounded-lg border border-[#E2E8F0] bg-[#F5F5F5] text-sm text-[#737373]">
              {watch("city") || "—"}
            </div>
            <p className="mt-1.5 text-xs text-[#737373]">Set above in Basic Info</p>
          </div>

          <Input
            label="Province"
            value="Metro Manila"
            readOnly
            disabled
            {...register("fullAddress.province")}
          />
        </div>

        <Input
          label="Region"
          value="NCR"
          readOnly
          disabled
          {...register("fullAddress.region")}
        />
      </section>

      <Divider />

      {/* Operating Hours */}
      <section className="space-y-5">
        <div>
          <h2 className="text-base font-bold text-[#0F172A]">Operating Hours</h2>
          <p className="text-sm text-[#737373] mt-0.5">Set your court&apos;s schedule. At least one day must be open.</p>
        </div>

        {errors.operatingHours?.root && (
          <p className="text-sm font-medium text-[#DC2626]">{(errors.operatingHours.root as any)?.message}</p>
        )}
        {typeof errors.operatingHours?.message === "string" && (
          <p className="text-sm font-medium text-[#DC2626]">{errors.operatingHours.message}</p>
        )}

        <div className="rounded-xl border border-[#E2E8F0] overflow-hidden">
          {DAYS.map((day, idx) => {
            const isOpen = operatingHours?.[day]?.isOpen ?? false;
            const isLast = idx === DAYS.length - 1;
            return (
              <div
                key={day}
                className={[
                  "flex items-center gap-4 px-4 py-3",
                  !isLast ? "border-b border-[#F1F5F9]" : "",
                  isOpen ? "bg-white" : "bg-[#F8FAFC]",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <label className="flex items-center gap-2.5 cursor-pointer select-none w-32 shrink-0">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-[#E2E8F0] text-[#E84C1F] focus:ring-[#E84C1F]/25 cursor-pointer"
                    {...register(`operatingHours.${day}.isOpen`)}
                  />
                  <span className={`text-sm font-semibold ${isOpen ? "text-[#0F172A]" : "text-[#A3A3A3]"}`}>
                    {DAY_LABELS[day]}
                  </span>
                </label>

                {isOpen ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      disabled={!isOpen}
                      className={[
                        "rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] text-sm font-medium",
                        "px-3 py-1.5 h-9 focus:outline-none focus:ring-2 focus:ring-[#E84C1F]/25 focus:border-[#E84C1F]",
                        "disabled:opacity-50 disabled:bg-[#F5F5F5]",
                      ].join(" ")}
                      {...register(`operatingHours.${day}.openingTime`)}
                    />
                    <span className="text-[#A3A3A3] text-sm">to</span>
                    <input
                      type="time"
                      disabled={!isOpen}
                      className={[
                        "rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] text-sm font-medium",
                        "px-3 py-1.5 h-9 focus:outline-none focus:ring-2 focus:ring-[#E84C1F]/25 focus:border-[#E84C1F]",
                        "disabled:opacity-50 disabled:bg-[#F5F5F5]",
                      ].join(" ")}
                      {...register(`operatingHours.${day}.closingTime`)}
                    />
                  </div>
                ) : (
                  <span className="text-sm text-[#A3A3A3] flex-1">Closed</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Root error */}
      {errors.root && (
        <p role="alert" className="text-sm font-medium text-[#DC2626] flex items-center gap-1.5">
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 3.75a.75.75 0 011.5 0v4a.75.75 0 01-1.5 0v-4zm.75 7.25a.875.875 0 110-1.75.875.875 0 010 1.75z" />
          </svg>
          {errors.root.message}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={() => router.push("/owner/dashboard?tab=listings")}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md" loading={isPending}>
          {isEdit ? "Update Court" : "Save Court"}
        </Button>
      </div>
    </form>
  );
}
