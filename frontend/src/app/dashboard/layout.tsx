import Navigation from "@/components/Navigation";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-transparent relative pb-24 md:pb-0">
      <Navigation />
      <main className="w-full relative z-0">
        {children}
      </main>
    </div>
  );
}
