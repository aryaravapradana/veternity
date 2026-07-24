import { Skeleton, NavbarSkeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-[#F8F6F0] w-full flex flex-col">
      <NavbarSkeleton />
      <main className="max-w-5xl mx-auto w-full px-4 py-6 space-y-6 flex-1">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="w-full aspect-square rounded-3xl" />
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <Skeleton className="h-8 w-3/4 rounded-xl" />
              <Skeleton className="h-6 w-1/3 rounded-lg" />
              <Skeleton className="h-10 w-1/2 rounded-xl" />
              <div className="pt-4 space-y-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
                <Skeleton className="h-4 w-4/6 rounded-md" />
              </div>
            </div>
            <div className="flex items-center gap-4 pt-6">
              <Skeleton className="h-12 flex-1 rounded-2xl" />
              <Skeleton className="h-12 w-36 rounded-2xl" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
