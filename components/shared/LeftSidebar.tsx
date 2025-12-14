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
      <div className=' flex h-9/10  flex-col gap-8 px-8 bg-gray-600 text-xl text-white font-sans'>
        {sidebarLinks.map((link) => {
          
          let routePath = link.route; 

          // 3. --- Dynamic Route Adjustment (MUST happen BEFORE isActive check) ---
          if (link.route === "/profile" && userId) {
            routePath = `${link.route}/${userId}`;
          } else if (link.route === "/profile" && !userId) {
              // Optional: If user is not logged in, point the profile link to the sign-in page
              routePath = '/sign-in'; 
          }

          // 4. --- Correct Active Check Logic ---
          // pathName.includes(link.route) is often too broad.
          // Use startsWith for better nested route matching (e.g., /settings/account is active for /settings).
          const isActive = 
            (routePath === '/' && pathName === '/') ||
            (routePath !== '/' && pathName.startsWith(routePath));
          
          // 5. --- Corrected CSS Class Syntax ---
          return (
            <Link
              href={routePath}
              key={link.label}
              // The class structure must be: `static_classes ${conditional_classes}`
              className={`leftsidebar_link ${isActive ? "no-underline bg-purple-500 rounded" : ""}`}
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
      <div className='mt-10'>
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