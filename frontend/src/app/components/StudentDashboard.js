import { useEffect, useState } from 'react';
import { apiClient } from '../utils/api';
import QRScanner from './QRScanner';
import AttendanceGraph from './AttendanceGraph';

export default function StudentDashboard() {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    // Fetch student attendance history
    const fetchAttendance = async () => {
      const res = await apiClient.get('/attendance/student');
      setAttendance(res.data);
    };
    fetchAttendance();
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Your Attendance Dashboard</h1>
      <QRScanner />
      <AttendanceGraph data={attendance} />
      <div className="mt-5">
        <h2 className="text-xl font-semibold">Your Score: 85%</h2>
      </div>
    </div>
  );
}
