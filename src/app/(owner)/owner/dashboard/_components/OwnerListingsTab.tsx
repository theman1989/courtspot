"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import DeleteListingDialog from "./DeleteListingDialog";
import type { OwnerDashboardListing } from "@/features/listing/types";

type BadgeVariantType = "success" | "warning" | "info" | "error" | "default";

const STATUS_CONFIG: Record<string, { variant: BadgeVariantType; label: string }> = {
  active: { variant: "success", label: "Active" },
  pending_approval: { variant: "warning", label: "Pending" },
  inactive: { variant: "default", label: "Inactive" },
  archived: { variant: "error", label: "Archived" },
  rejected: { variant: "error", label: "Rejected" },
  suspended: { variant: "error", label: "Suspended" },
};

const SPORT_VARIANT: Record<string, string> = {
  basketball: "basketball",
  tennis: "tennis",
  badminton: "badminton",
  futsal: "soccer",
};

export default function OwnerListingsTab({
  listings,
}: {
  listings: OwnerDashboardListing[];
}) {
  const [deletingListing, setDeletingListing] = useState<{
    id: string;
    name: string;
  } | null>(null);

  if (listings.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center space-y-4">
        <p className="text-[#0F172A] font-bold text-lg">No courts listed yet</p>
        <p className="text-[#737373] text-sm">
          Add your first court to start accepting bookings.
        </p>
        <Link
          href="/owner/courts/new"
          className="inline-flex items-center justify-center h-10 px-4 text-sm gap-2 rounded-lg font-semibold tracking-wide bg-[#E84C1F] text-white hover:bg-[#C93E18] active:bg-[#B03515] shadow-[0_4px_14px_0_rgb(232_76_31/0.3)] hover:shadow-[0_6px_20px_0_rgb(232_76_31/0.4)] transition-all duration-150"
        >
          Add Your First Court
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <span className="text-sm font-semibold text-[#0F172A]">
            {listings.length} {listings.length === 1 ? "court" : "courts"}
          </span>
          <Link
            href="/owner/courts/new"
            className="inline-flex items-center justify-center h-8 px-3 text-xs gap-1.5 rounded-md font-semibold tracking-wide bg-[#E84C1F] text-white hover:bg-[#C93E18] active:bg-[#B03515] transition-all duration-150"
          >
            + Add Court
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                {(["Court", "Sport", "City", "Price / hr", "Rating", "Status", "Actions"] as const).map(
                  (heading, i) => (
                    <th
                      key={heading}
                      className={`px-5 py-3 text-xs font-semibold text-[#737373] uppercase tracking-wider ${
                        i >= 6 ? "text-right" : "text-left"
                      }`}
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {listings.map((listing) => {
                const statusCfg = STATUS_CONFIG[listing.status] ?? {
                  variant: "default" as BadgeVariantType,
                  label: listing.status,
                };
                const sportVariant = SPORT_VARIANT[listing.sport] ?? "default";

                return (
                  <tr key={listing._id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-4 font-semibold text-[#0F172A]">
                      {listing.name}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={sportVariant as any} size="sm">
                        {listing.sport}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-[#525252]">{listing.city}</td>
                    <td className="px-5 py-4 font-black text-[#E84C1F]">
                      ₱{listing.pricePerHour.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-[#525252]">
                      {listing.averageRating > 0 ? (
                        <>
                          <span className="text-[#E84C1F]">★</span>{" "}
                          {listing.averageRating.toFixed(1)}{" "}
                          <span className="text-[#A3A3A3]">({listing.reviewCount})</span>
                        </>
                      ) : (
                        <span className="text-[#A3A3A3]">No reviews</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={statusCfg.variant} dot size="sm">
                        {statusCfg.label}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/owner/courts/${listing._id}/edit`}
                          className="inline-flex items-center justify-center h-8 px-3 text-xs font-semibold rounded-md bg-transparent text-[#0F172A] hover:bg-[#F1F5F9] active:bg-[#E2E8F0] transition-all"
                        >
                          Edit
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            setDeletingListing({ id: listing._id, name: listing.name })
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {deletingListing && (
        <DeleteListingDialog
          listingId={deletingListing.id}
          listingName={deletingListing.name}
          onClose={() => setDeletingListing(null)}
        />
      )}
    </>
  );
}
