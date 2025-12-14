import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// PROTECT AND CONTROL ROUTE
const isOnboardingRoute = createRouteMatcher(['/onboarding'])
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  "/api/uploadthing",
])


export default clerkMiddleware(async (auth, req : NextRequest) => {

  if (isPublicRoute(req)) {
    return NextResponse.next();
  }
  
  if (!isPublicRoute(req)) {
   await auth.protect(
        // If protection fails, redirect to the sign-in page
        // unauthenticatedUrl: '/sign-in' 
    );
  }
  const { userId, sessionClaims, redirectToSignIn } = await auth()

   // If the user isn't signed in and the route is private, redirect to sign-in
  // if (!userId && !isPublicRoute(req)) return redirectToSignIn({ returnBackUrl: req.url })

    // BUT CLERK DOESNT STORE SESSIONCLAIMS!! IT DOESNT WORK Check if the user is authenticated but NOT onboarded. 
    const isNotOnboarded = userId && !sessionClaims?.metadata?.onboardingComplete;

    // A. If user is NOT onboarded AND NOT trying to reach /onboarding, REDIRECT them to /onboarding.
    if (isNotOnboarded && !isOnboardingRoute(req)) {
        const onboardingUrl = new URL('/onboarding', req.url);
        return NextResponse.redirect(onboardingUrl);
    }

  // THIS IS CLERK DOCUMENTION
  // For users visiting /onboarding, don't try to redirect
  if (userId && isOnboardingRoute(req)) {
    return NextResponse.next()
  }

 
  // THIS LINE IS IMPLICITELY APPLIED
  // return NextResponse.next();

})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}