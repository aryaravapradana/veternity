import { Skeleton, DashboardHeaderSkeleton, ProductGridSkeleton } from "@/components/ui/skeleton";

export default function HubLoading() {
  return (
    <div className="min-h-screen bg-[#F8F6F0] w-full flex flex-col p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <DashboardHeaderSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-[#E8E3D2] space-y-4">
          <Skeleton className="h-6 w-36 rounded-md" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
        <div className="bg-white rounded-3xl p-6 border border-[#E8E3D2] space-y-4">
          <Skeleton className="h-6 w-44 rounded-md" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
      <Skeleton className="h-7 w-40 rounded-lg" />
      <ProductGridSkeleton count={4} />
    </div>
  );
}
