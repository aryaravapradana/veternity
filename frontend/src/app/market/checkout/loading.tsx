import { Skeleton, NavbarSkeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-[#F8F6F0] w-full flex flex-col">
      <NavbarSkeleton />
      <main className="max-w-3xl mx-auto w-full px-4 py-6 space-y-6 flex-1">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <div className="bg-white rounded-3xl p-6 border border-[#E8E3D2] space-y-4">
          <Skeleton className="h-6 w-36 rounded-md" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
        <div className="bg-white rounded-3xl p-6 border border-[#E8E3D2] space-y-4">
          <Skeleton className="h-6 w-44 rounded-md" />
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-14 w-full rounded-2xl" />
      </main>
    </div>
  );
}
