import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-[#E8E3D2]/60 dark:bg-slate-800/60",
        className
      )}
      {...props}
    />
  );
}

// ─── REUSABLE PAGE SKELETON COMPONENTS ───────────────────────────────────────

export function NavbarSkeleton() {
  return (
    <div className="w-full bg-[#F8F6F0] border-b border-[#E8E3D2] px-4 py-3 flex items-center justify-between gap-4">
      <Skeleton className="h-9 w-28 rounded-xl" />
      <Skeleton className="h-10 flex-1 max-w-xl rounded-full" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
}

export function MarketHeroSkeleton() {
  return (
    <div className="w-full bg-[#2B4C3B]/20 rounded-[2.5rem] p-6 sm:p-10 flex items-center justify-between min-h-[200px] sm:min-h-[260px] relative overflow-hidden">
      <div className="space-y-3 max-w-[55%]">
        <Skeleton className="h-8 sm:h-12 w-4/5 rounded-xl bg-[#2B4C3B]/30" />
        <Skeleton className="h-6 sm:h-8 w-3/5 rounded-xl bg-[#2B4C3B]/30" />
        <Skeleton className="h-4 sm:h-5 w-full rounded-lg bg-[#2B4C3B]/20" />
      </div>
      <Skeleton className="h-32 sm:h-48 w-36 sm:w-64 rounded-3xl bg-[#2B4C3B]/30" />
    </div>
  );
}

export function CategoryCardsSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-xl mx-auto my-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="aspect-[1/0.9] rounded-2xl p-3 flex flex-col justify-between" />
      ))}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-3 border border-[#E8E3D2] flex flex-col gap-3">
      <Skeleton className="w-full aspect-square rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <Skeleton className="h-3 w-1/2 rounded-md" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-24 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DashboardHeaderSkeleton() {
  return (
    <div className="w-full p-4 sm:p-6 bg-[#2B4C3B] rounded-3xl text-white space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 rounded-lg bg-white/20" />
          <Skeleton className="h-4 w-32 rounded-md bg-white/10" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full bg-white/20" />
      </div>
      <div className="grid grid-cols-3 gap-3 pt-2">
        <Skeleton className="h-16 rounded-2xl bg-white/15" />
        <Skeleton className="h-16 rounded-2xl bg-white/15" />
        <Skeleton className="h-16 rounded-2xl bg-white/15" />
      </div>
    </div>
  );
}
