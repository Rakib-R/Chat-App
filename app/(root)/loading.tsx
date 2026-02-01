
import ThreadSkeleton from "@/components/skeletons/ThreadSkeleton";
export default function Loading() {
  return( 
    <main className="flex flex-col my-4">
    <ThreadSkeleton />
    <ThreadSkeleton />
    <ThreadSkeleton />
    
    </main>
        
  )
}