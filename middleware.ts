import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// PROTECT AND CONTROL ROUTE
const isOnboardingRoute = createRouteMatcher(['/onboarding'])
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  "/api/uploadthing",
  "/api/webhooks/clerk",
])


export default clerkMiddleware(async (auth, req : NextRequest) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth()

  if (isPublicRoute(req)) {
    return NextResponse.next();
  }
  
 // 2. PROTECT PRIVATE ROUTES
  if (!userId) {
    // This handles the redirect to sign-in automatically
    await auth.protect(); 
  }
  
   // If the user isn't signed in and the route is private, redirect to sign-in
  if (!userId && !isPublicRoute(req)) return redirectToSignIn({ returnBackUrl: req.url })
    

  // THIS IS CLERK DOCUMENTION
  // For users visiting /onboarding, don't try to redirect
  if (userId && isOnboardingRoute(req)) {
    return NextResponse.next()
  }

//  Create a new headers object based on the incoming request headers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', req.nextUrl.pathname);
  const isFirstTime = sessionClaims?.metadata?.isFirstTimeUser;
  if (isFirstTime) {
  requestHeaders.set('x-first-time', 'true');
}

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  });
})

export const config = {
matcher: [
    // Standard Next.js middleware matcher
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ]
};