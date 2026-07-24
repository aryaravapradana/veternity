import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="min-h-screen bg-[#F8F6F0] w-full p-4 sm:p-6 space-y-6 max-w-3xl mx-auto">
      <Skeleton className="h-8 w-44 rounded-xl" />
      <div className="bg-white rounded-3xl p-6 border border-[#E8E3D2] space-y-5">
        <div className="flex items-center gap-4">
          <Skeleton className="w-20 h-20 rounded-full shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-40 rounded-md" />
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-12 w-full rounded-2xl" />
        <Skeleton className="h-12 w-full rounded-2xl" />
        <Skeleton className="h-12 w-full rounded-2xl" />
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    </div>
  );
}
