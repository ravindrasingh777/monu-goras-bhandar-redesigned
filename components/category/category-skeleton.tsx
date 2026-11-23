import { Skeleton } from "@/components/ui/skeleton";

export default function CategorySkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton
          key={index}
          className="h-8 w-28 rounded-full"
        />
      ))}
    </div>
  );
}