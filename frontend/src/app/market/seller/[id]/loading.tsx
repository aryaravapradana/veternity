import { Skeleton, NavbarSkeleton, ProductGridSkeleton } from "@/components/ui/skeleton";

export default function SellerLoading() {
  return (
    <div className="min-h-screen bg-[#F8F6F0] w-full flex flex-col">
      <NavbarSkeleton />
      <main className="max-w-7xl mx-auto w-full px-4 py-6 space-y-6 flex-1">
        <div className="bg-white rounded-3xl p-6 border border-[#E8E3D2] flex items-center gap-6">
          <Skeleton className="w-24 h-24 rounded-full shrink-0" />
          <div className="space-y-3 flex-1">
            <Skeleton className="h-7 w-48 rounded-lg" />
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-4 w-64 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-7 w-40 rounded-lg" />
        <ProductGridSkeleton count={8} />
      </main>
    </div>
  );
}
