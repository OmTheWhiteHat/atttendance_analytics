'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QRScanner from '../../components/QRScanner';
import AttendanceGraph from '../../components/AttendanceGraph';

export default function StudentDashboard() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const [attendance, setAttendance] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({
    totalClasses: 0,
    attendedClasses: 0,
    attendancePercentage: 0,
    streak: 0
  });

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/student/sign-in');
    } else if (isLoaded && isSignedIn && user) {
      // Check if onboarding is complete
      const onboardingComplete = user.publicMetadata?.onboardingComplete;
      if (!onboardingComplete) {
        router.push('/student/onboarding');
      }
    }
  }, [isSignedIn, isLoaded, user, router]);

  useEffect(() => {
    if (isSignedIn && user && user.publicMetadata?.onboardingComplete) {
      // Fetch student data and attendance
      fetchStudentData();
    }
  }, [isSignedIn, user]);

  const fetchStudentData = async () => {
    try {
      // Fetch student profile data
      const studentResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/profile/${user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('clerk-token') || 'mock-token'}`,
          }
        }
      );
      
      if (studentResponse.ok) {
        const studentData = await studentResponse.json();
        // You can use student data here if needed
        console.log('Student data:', studentData);
      }
      
      // For now, still using mock attendance data
      // Later, this will fetch real attendance from backend
      const mockAttendance = [
        { timestamp: '2024-01-15', status: 'present', course: 'Mathematics' },
        { timestamp: '2024-01-16', status: 'present', course: 'Physics' },
        { timestamp: '2024-01-17', status: 'absent', course: 'Chemistry' },
        { timestamp: '2024-01-18', status: 'present', course: 'Mathematics' },
      ];
      
      setAttendance(mockAttendance);
      
      // Calculate stats
      const total = mockAttendance.length;
      const attended = mockAttendance.filter(a => a.status === 'present').length;
      const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;
      
      setAttendanceStats({
        totalClasses: total,
        attendedClasses: attended,
        attendancePercentage: percentage,
        streak: 3 // Mock streak
      });
    } catch (error) {
      console.error('Failed to fetch student data:', error);
      
      // Fallback to mock data if fetch fails
      const mockAttendance = [
        { timestamp: '2024-01-15', status: 'present', course: 'Mathematics' },
        { timestamp: '2024-01-16', status: 'present', course: 'Physics' },
      ];
      setAttendance(mockAttendance);
      setAttendanceStats({
        totalClasses: 2,
        attendedClasses: 2,
        attendancePercentage: 100,
        streak: 2
      });
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AttendRight</h1>
              <p className="text-sm text-gray-600">Student Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user.firstName || user.emailAddresses[0].emailAddress}!
              </span>
              <UserButton afterSignOutUrl="/student/sign-in" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">
              {attendanceStats.attendancePercentage}%
            </div>
            <div className="text-sm text-gray-600">Attendance Rate</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">
              {attendanceStats.attendedClasses}
            </div>
            <div className="text-sm text-gray-600">Classes Attended</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-gray-900">
              {attendanceStats.totalClasses}
            </div>
            <div className="text-sm text-gray-600">Total Classes</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-purple-600">
              {attendanceStats.streak}
            </div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
        </div>

        {/* QR Scanner and Attendance Graph */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Scanner */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Mark Attendance</h2>
            <QRScanner />
          </div>

          {/* Attendance Graph */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Attendance Overview</h2>
            <AttendanceGraph data={attendance} />
          </div>
        </div>

        {/* Recent Attendance */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Attendance</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Course</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{new Date(record.timestamp).toLocaleDateString()}</td>
                      <td className="py-2">{record.course}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          record.status === 'present' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}