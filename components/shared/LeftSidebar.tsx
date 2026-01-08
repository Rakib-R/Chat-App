'use client'

import Image from "next/image";
import Link from "next/link";
import { SignOutButton, SignedIn } from "@clerk/nextjs";
import { useUser } from '@clerk/nextjs';
import { sidebarLinks } from "@/constants";

import { usePathname } from "next/navigation";
// Removed unnecessary `useRouter` and `useEffect`/`useState`

const LeftSidebar = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const pathName = usePathname(); // The current URL pathname (e.g., '/profile/123')
  const userId = isSignedIn ? user?.id : null; 
  
  // 2. -- CRITICAL FIX: Handle Loading State ---
      // STUPID GEMINI HALLUCINATION AND HIGH IGNORANCE .. IT RUNS WITHOUT THIS BLOCK OF CODE !!!!

  // if (!isLoaded) {
  //   // Return a loading state while Clerk initializes
  //   return <div className='p-8 text-white text-center'>Loading...</div>; 
  // }
  // --- Removed unnecessary useEffect/useState ---

  return (
    <section className='custom-scrollbar'>
      <div className='flex flex-col py-8 gap-8 px-8 bg-gray-600 text-xl text-white font-sans'>
        
      <Link 
          className="relative flex items-center px-2 py-2 gap-4 hover:bg-slate-900/10 rounded-lg group transition-all"
          href={`/profile/${user?.id}`}
        >
          {/* Animated Background Layer */}
          <div className="absolute bg-red-600 inset-0 -z-10 opacity-0 scale-95 blur-sm 
                          group-hover:opacity-50 group-hover:scale-105 group-hover:blur-none 
                          transition-all duration-300 ease-out rounded-lg pointer-events-none" />
              <img 
                className='rounded-xl relative z-10 transition-transform group-hover:scale-110' 
                src={user?.imageUrl} 
                alt="" 
                width={33} 
                height={33} 
              />
          
          <span className="relative z-10 text-white font-medium">
            {user?.fullName}
          </span>
        </Link>
        {sidebarLinks.map((link) => {
          
          let routePath = link.route; 

          // --- Dynamic Route Adjustment (MUST happen BEFORE isActive check) ---
          if (link.route === "/profile" && userId) {
            routePath = `${link.route}/${userId}`;
          } else if (link.route === "/profile" && !userId) {
              // Optional: If user is not logged in, point the profile link to the sign-in page
              routePath = '/sign-in'; 
          }

          // --- Correct Active Check Logic ---
          // pathName.includes(link.route) is often too broad.
          const isActive = 
            (routePath === '/' && pathName === '/') ||
            (routePath !== '/' && pathName.startsWith(routePath));
          

          return (
            <Link
              href={routePath}
              key={link.label}
              // The class structure must be: `static_classes ${conditional_classes}`
              className={`leftsidebar_link ${isActive ? " no-underline bg-blue-900/80 rounded-xl" : ""}`}
            >
              <div className="flex gap-5 p-3 ">
                <div className="">
                  <Image
                    src={link.imgURL}
                    alt={link.label}
                    width={24}
                    height={24}
                    className=""
                  />
                </div>
                <p className='no-underline text-light-1 max-lg:hidden'>{link.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 6. --- Use SignedIn to show/hide Clerk components --- */}
      <div className='mt-4'>
          <SignedIn>
            <SignOutButton signOutOptions={{redirectUrl: '/'}}>
              <div className='flex p-3 gap-5 cursor-pointer bg-slate-400'>
                <p className='text-light-2 max-lg:hidden text-pink-600 text-xl '>Logout</p>
                <Image
                  src='/assets/logout.svg'
                  alt='logout'
                  width={34}
                  height={34}
                />
              </div>
            </SignOutButton>
          </SignedIn>
          {/* Optional: Add a SignedOut block if you want to show a Sign In link */}
      </div>
    </section>
  );
};

export default LeftSidebar;