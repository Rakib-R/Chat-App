// components/skeletons/FeedSkeleton.tsx
'use client'
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have shadcn or similar

const FeedSkeleton = () => {
  // We use 4 because your pagination limit is 4
  const skeletonCount = [1, 2, 3, 4]; 

  return (
    <div className="flex flex-col gap-10">
      {skeletonCount.map((index) => (
        <div key={index} className="flex flex-col gap-2 rounded-xl bg-white/10 p-7">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" /> {/* Avatar */}
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-32" /> {/* Name */}
              <Skeleton className="h-3 w-20" /> {/* Date */}
            </div>
          </div>
          <Skeleton className="mt-4 h-16 w-full" /> {/* Content Body */}
          <div className="mt-4 flex gap-4">
            <Skeleton className="h-6 w-16" /> {/* Buttons */}
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedSkeleton;