import Link from "next/link";
import ListingForm from "@/features/listing/components/ListingForm";

export default function NewListingPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
      <div className="space-y-1">
        <nav className="text-sm text-[#737373]">
          <Link href="/owner/dashboard?tab=listings" className="hover:text-[#E84C1F] transition-colors">
            Listings
          </Link>
          <span className="mx-2">›</span>
          <span className="text-[#0F172A] font-medium">New Court</span>
        </nav>
        <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Add a Court</h1>
        <p className="text-[#737373] text-sm">Fill in the details below to list your court on CourtSpot.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 md:p-8">
        <ListingForm />
      </div>
    </div>
  );
}
