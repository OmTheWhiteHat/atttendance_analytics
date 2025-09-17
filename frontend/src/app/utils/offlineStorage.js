import Dexie from 'dexie';

export const db = new Dexie('AttendanceDB');
db.version(1).stores({
  attendance: '++id, sessionId, status, timestamp',
});

// Save attendance offline
export const saveAttendanceOffline = async (record) => {
  await db.attendance.add(record);
};

// Sync attendance when online
export const syncAttendance = async (apiClient) => {
  const allRecords = await db.attendance.toArray();
  for (const rec of allRecords) {
    try {
      await apiClient.post('/attendance/mark', rec);
      await db.attendance.delete(rec.id);
    } catch (err) {
      console.error('Sync failed', err);
    }
  }
};
