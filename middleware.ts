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


export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims } = await auth();

  // 1. Allow public routes (sign-in, sign-up, webhooks) to pass through immediately
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // 2. Protect all other routes
  if (!userId) {
    await auth.protect();
  }

  // 3. Handle Onboarding bypass
  if (userId && isOnboardingRoute(req)) {
    return NextResponse.next();
  }

  // 4. Metadata sync for first-time users
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', req.nextUrl.pathname);
  
  // Note: Ensure your Clerk JWT template includes "metadata"
  if (sessionClaims?.metadata?.isFirstTimeUser) {
    requestHeaders.set('x-first-time', 'true');
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  });
});

export const config = {
matcher: [
    // Standard Next.js middleware matcher
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ]
};