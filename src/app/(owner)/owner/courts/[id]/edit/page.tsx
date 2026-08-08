import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getListingForEdit } from "@/features/listing";
import ListingForm from "@/features/listing/components/ListingForm";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!session.user.role.includes("owner")) redirect("/dashboard");

  const { id } = await params;
  const listing = await getListingForEdit(session.user.id, id);

  if (!listing) redirect("/owner/dashboard?tab=listings");

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
      <div className="space-y-1">
        <nav className="text-sm text-[#737373]">
          <Link href="/owner/dashboard?tab=listings" className="hover:text-[#E84C1F] transition-colors">
            Listings
          </Link>
          <span className="mx-2">›</span>
          <span className="text-[#0F172A] font-medium">Edit Court</span>
        </nav>
        <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Edit Court</h1>
        <p className="text-[#737373] text-sm">
          Editing{" "}
          <span className="font-semibold text-[#0F172A]">{listing.name}</span>
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 md:p-8">
        <ListingForm listing={listing} />
      </div>
    </div>
  );
}
