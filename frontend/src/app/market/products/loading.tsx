import { Skeleton, NavbarSkeleton, CategoryCardsSkeleton, ProductGridSkeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-[#F8F6F0] w-full flex flex-col">
      <NavbarSkeleton />
      <main className="max-w-7xl mx-auto w-full px-4 py-6 space-y-6 flex-1">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>
        <CategoryCardsSkeleton />
        <ProductGridSkeleton count={12} />
      </main>
    </div>
  );
}
