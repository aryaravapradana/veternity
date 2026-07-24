import { Skeleton } from "@/components/ui/skeleton";

export default function HubOrdersLoading() {
  return (
    <div className="min-h-screen bg-[#F8F6F0] w-full p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-44 rounded-xl" />
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-3xl p-5 border border-[#E8E3D2] space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-36 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-6 w-28 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
