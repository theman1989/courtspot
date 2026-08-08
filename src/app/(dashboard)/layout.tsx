import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import DashboardNav from "./_components/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (!session.user.role.includes("booker")) redirect("/owner/dashboard");

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <DashboardNav user={session.user} />
      <main>{children}</main>
    </div>
  );
}
