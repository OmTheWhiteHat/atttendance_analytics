'use client';

import { ClerkProvider } from '@clerk/nextjs';

export default function StudentLayout({ children }) {
  // Check if Clerk is properly configured
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkConfigured = publishableKey && 
    publishableKey.startsWith('pk_') && 
    publishableKey !== 'pk_test_placeholder_get_real_key_from_clerk_dashboard';

  if (!isClerkConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="max-w-md mx-auto text-center p-6">
          <h1 className="text-2xl font-bold text-yellow-800 mb-4">⚠️ Clerk Setup Required</h1>
          <p className="text-yellow-700 mb-4">
            Please configure your Clerk API keys in <code className="bg-yellow-200 px-2 py-1 rounded">.env.local</code> to enable student authentication.
          </p>
          <p className="text-sm text-yellow-600 mb-6">
            See <code>CLERK_SETUP.md</code> for detailed instructions.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">In the meantime, you can access:</p>
            <div className="flex justify-center space-x-4">
              <a 
                href="/teacher/login" 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Teacher Login
              </a>
              <a 
                href="/admin/login" 
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Admin Login
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  );
}