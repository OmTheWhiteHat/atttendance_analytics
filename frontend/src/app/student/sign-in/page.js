'use client';

import { SignIn } from '@clerk/nextjs';

export default function StudentSignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AttendRight</h1>
          <p className="text-gray-600 mt-2">Student Login</p>
        </div>
        <SignIn 
          path="/student/sign-in"
          routing="path"
          signUpUrl="/student/sign-up"
          afterSignInUrl="/student/dashboard"
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
              card: "shadow-lg border border-gray-200",
              headerTitle: "text-xl font-semibold text-gray-900",
              headerSubtitle: "text-gray-600",
            },
          }}
        />
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Are you a teacher or admin?{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-500">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}