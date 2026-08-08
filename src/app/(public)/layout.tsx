import PublicNav from "./_components/PublicNav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PublicNav />
      <main>{children}</main>
    </div>
  );
}
