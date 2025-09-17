// Temporarily disable middleware to avoid Clerk compatibility issues
// This will be re-enabled once Clerk is properly configured

// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Simple middleware that doesn't interfere with routes
export default function middleware(req) {
  // Allow all requests to pass through for now
  return;
}

export const config = {
  matcher: [
    // Only match student routes when Clerk is needed
    '/student/dashboard/:path*',
  ],
};
