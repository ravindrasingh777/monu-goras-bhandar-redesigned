
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col items-center">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="mt-5 h-8 w-64" />
          <Skeleton className="mt-3 h-4 w-80 max-w-full" />

          <div className="mt-5 flex gap-2">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-7 w-28" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Left Content */}
          <div className="space-y-6 lg:col-span-2">

            {/* Order Information */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-44" />
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Products */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-5">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-20 w-20 shrink-0 rounded-lg" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Addresses */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {[1, 2].map((item) => (
                <Card key={item}>
                  <CardHeader>
                    <Skeleton className="h-6 w-40" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex justify-between gap-4">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Details */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-44" />
              </CardHeader>
              <CardContent className="space-y-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between gap-4">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>

          {/* Right - Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-36" />
              </CardHeader>

              <CardContent className="space-y-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex justify-between gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}

                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </main>
  );
}
