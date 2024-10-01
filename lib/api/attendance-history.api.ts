import { HistoryRecord, HistoryRecordBody } from '@/types/HistoryRecord';

const attendanceHistoryApi = {
  list: async (): Promise<HistoryRecord[]> => {
    const request = await fetch('/api/attendance-history');
    return await request.json();
  },
  create: async (discipline: HistoryRecordBody) => {
    return await fetch('/api/attendance-history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discipline),
    });
  },
};

export { attendanceHistoryApi };
