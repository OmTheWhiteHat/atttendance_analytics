'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function StudentDashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Your role is: {user.roles.join(', ')}</p>
      <button onClick={logout}>Logout</button>
      {/* The rest of the student dashboard will go here */}
    </div>
  );
}