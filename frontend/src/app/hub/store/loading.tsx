import { Skeleton, ProductGridSkeleton } from "@/components/ui/skeleton";

export default function HubStoreLoading() {
  return (
    <div className="min-h-screen bg-[#F8F6F0] w-full p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <Skeleton className="h-10 w-36 rounded-2xl" />
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  );
}
