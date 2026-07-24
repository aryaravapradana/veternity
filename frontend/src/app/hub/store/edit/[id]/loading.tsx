import { Skeleton } from "@/components/ui/skeleton";

export default function EditProductLoading() {
  return (
    <div className="min-h-screen bg-[#F8F6F0] w-full p-4 sm:p-6 space-y-6 max-w-3xl mx-auto">
      <Skeleton className="h-8 w-44 rounded-xl" />
      <div className="bg-white rounded-3xl p-6 border border-[#E8E3D2] space-y-5">
        <Skeleton className="h-6 w-32 rounded-md" />
        <Skeleton className="h-12 w-full rounded-2xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-12 rounded-2xl" />
          <Skeleton className="h-12 rounded-2xl" />
        </div>
        <Skeleton className="h-14 w-full rounded-2xl" />
      </div>
    </div>
  );
}
