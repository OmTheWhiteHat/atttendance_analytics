'use client';

import { useState } from 'react';
import { apiClient } from '../utils/api';

export default function QRScanner() {
  const [qrData, setQrData] = useState('');
  const [scanning, setScanning] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleManualInput = async (e) => {
    e.preventDefault();
    const sessionId = e.target.sessionId.value;
    
    if (sessionId) {
      setScanning(true);
      try {
        // Mark attendance
        await apiClient.post('/attendance/mark', { sessionId });
        setQrData(sessionId);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (error) {
        alert('Failed to mark attendance: ' + (error.response?.data?.message || error.message));
      } finally {
        setScanning(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* For now, using manual input instead of camera-based scanning */}
      <div className="bg-gray-100 p-6 rounded-lg text-center">
        <div className="mb-4">
          <div className="w-24 h-24 mx-auto bg-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-gray-600 text-sm">QR Scanner</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Camera-based QR scanning will be implemented here
        </p>
        
        {/* Manual input for testing */}
        <form onSubmit={handleManualInput} className="space-y-3">
          <input
            name="sessionId"
            type="text"
            placeholder="Enter Session ID manually"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            required
          />
          <button
            type="submit"
            disabled={scanning}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50"
          >
            {scanning ? 'Marking Attendance...' : 'Mark Attendance'}
          </button>
        </form>
      </div>
      
      {success && (
        <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          ✅ Attendance marked successfully!
        </div>
      )}
      
      {qrData && (
        <p className="text-sm text-gray-600">Last Session: {qrData}</p>
      )}
    </div>
  );
}
