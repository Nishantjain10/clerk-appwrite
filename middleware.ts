import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)', 
  '/api/auth/appwrite(.*)',
  '/sso-callback(.*)'
]);

// Protected routes that require authentication
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)', // Match all paths except static files
    '/', // Match root
    '/(api|trpc)(.*)', // Match API routes
  ],
}; 