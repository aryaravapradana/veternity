import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading() {
  return (
    <div className="min-h-screen bg-[#F8F6F0] w-full flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 border border-[#E8E3D2] w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <Skeleton className="w-16 h-16 rounded-full" />
          <Skeleton className="h-7 w-36 rounded-lg" />
          <Skeleton className="h-4 w-48 rounded-md" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
