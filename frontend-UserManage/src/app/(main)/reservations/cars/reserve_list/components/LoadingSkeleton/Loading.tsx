import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          {/* Back Button */}
          <Skeleton className="w-40 h-10 rounded-md mb-4" />
          
          <div className="flex justify-between items-start">
            <div>
              {/* Title */}
              <Skeleton className="w-80 h-8 mb-2" />
              {/* Car Code */}
              <Skeleton className="w-48 h-5" />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Skeleton className="w-20 h-10 rounded-md" />
              <Skeleton className="w-16 h-10 rounded-md" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Gallery Card */}
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="relative">
                {/* Main Image */}
                <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <Skeleton className="w-full h-full" />
                </div>
                
                {/* Image Indicators */}
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="w-8 h-8 rounded-full" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Car Details Card */}
          <Card className="border-gray-200">
            <CardHeader>
              <Skeleton className="w-32 h-6" />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-4" />
                <Skeleton className="w-24 h-6 rounded-full" />
              </div>

              {/* Separator */}
              <div className="border-t border-gray-200"></div>

              {/* Specifications */}
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-5 h-5 rounded" />
                    <div className="flex-1">
                      <Skeleton className="w-20 h-4 mb-1" />
                      <Skeleton className="w-32 h-5" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Separator */}
              <div className="border-t border-gray-200"></div>

              {/* Remarks */}
              <div>
                <Skeleton className="w-16 h-4 mb-2" />
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Skeleton className="w-full h-4 mb-2" />
                  <Skeleton className="w-3/4 h-4" />
                </div>
              </div>

              {/* Separator */}
              <div className="border-t border-gray-200"></div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Skeleton className="flex-1 h-10 rounded-md" />
                <Skeleton className="flex-1 h-10 rounded-md" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information Card */}
        <Card className="mt-6 border-gray-200">
          <CardHeader>
            <Skeleton className="w-32 h-6" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Skeleton className="w-24 h-5 mb-2" />
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="w-16 h-4" />
                      <Skeleton className="w-24 h-4" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Skeleton className="w-32 h-5 mb-2" />
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="w-20 h-4" />
                      <Skeleton className="w-16 h-4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}