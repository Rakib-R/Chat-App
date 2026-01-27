'use client'
import dynamic from 'next/dynamic';

// This is the magic line. 
// It tells Next.js: "Don't download the VideoRoom code until the user actually hits this page."
const VideoRoom = dynamic(() => import('@/components/features/VideoRoom'), {
  ssr: false, // PeerJS cannot run on the server
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f]">
       <div className="animate-pulse text-indigo-400 font-bold">
         INITIALIZING SECURE VIDEO NODE...
       </div>
    </div>
  )
});

export default function RoomPage() {
  return <VideoRoom />;
}