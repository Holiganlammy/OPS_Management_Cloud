import { Skeleton } from "@/components/ui/skeleton";

export default function ReservationSkeleton() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <Skeleton className="h-8 w-1/2 mb-2" />
        <Skeleton className="h-5 w-1/3" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <Skeleton className="h-5 w-1/3 mb-1" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div>
          <Skeleton className="h-5 w-1/3 mb-1" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div>
          <Skeleton className="h-5 w-1/3 mb-1" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div>
          <Skeleton className="h-5 w-1/3 mb-1" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>

      <div className="mb-6">
        <Skeleton className="h-5 w-1/4 mb-2" />
        <Skeleton className="h-20 w-full" />
      </div>

      <div className="mb-6">
        <Skeleton className="h-6 w-1/2 mb-2" />
        <div className="space-y-2">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <Skeleton className="h-5 w-6" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    </div>
  );
}