import { Skeleton } from "@/components/ui/skeleton";

export default function IntelligenceLoading() {
  return (
    <div className="min-h-screen bg-[#F8F6F0] w-full p-4 sm:p-6 space-y-6 max-w-4xl mx-auto flex flex-col">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-7 w-48 rounded-xl" />
      </div>
      <div className="flex-1 bg-white rounded-3xl p-6 border border-[#E8E3D2] space-y-4 min-h-[400px]">
        <Skeleton className="h-16 w-3/4 rounded-2xl" />
        <Skeleton className="h-20 w-2/3 rounded-2xl ml-auto bg-[#2B4C3B]/20" />
        <Skeleton className="h-16 w-3/4 rounded-2xl" />
      </div>
      <Skeleton className="h-14 w-full rounded-2xl" />
    </div>
  );
}
