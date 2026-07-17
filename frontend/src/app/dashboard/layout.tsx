import DashboardNavbar from "@/components/DashboardNavbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#F8F6F0] relative">
      <DashboardNavbar />
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}
