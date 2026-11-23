import { Skeleton } from "@/components/ui/skeleton";

export default function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl "
        >
          {/* Product image */}
          <Skeleton className="aspect-square w-full rounded-none" />

          {/* Product details */}
          <div className="space-y-3 p-4">
            <Skeleton className="h-5 w-3/4" />

            <Skeleton className="h-4 w-1/2" />

            <Skeleton className="h-4 w-1/3" />

            {/* Enquire button */}
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}