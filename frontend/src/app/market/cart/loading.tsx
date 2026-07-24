import { Skeleton, NavbarSkeleton } from "@/components/ui/skeleton";

export default function CartLoading() {
  return (
    <div className="min-h-screen bg-[#F8F6F0] w-full flex flex-col">
      <NavbarSkeleton />
      <main className="max-w-4xl mx-auto w-full px-4 py-6 space-y-6 flex-1">
        <Skeleton className="h-8 w-40 rounded-xl" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-4 border border-[#E8E3D2] flex items-center gap-4">
              <Skeleton className="w-20 h-20 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-1/2 rounded-md" />
                <Skeleton className="h-4 w-1/4 rounded-md" />
              </div>
              <Skeleton className="h-9 w-28 rounded-xl" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-3xl p-6 border border-[#E8E3D2] space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-5 w-28 rounded-md" />
            <Skeleton className="h-6 w-32 rounded-md" />
          </div>
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
      </main>
    </div>
  );
}
