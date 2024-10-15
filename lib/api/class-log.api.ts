import { Filters, HistoryRecord, HistoryRecordBody } from '@/types/HistoryRecord';

const attendanceHistoryApi = {
  list: async (filters?: Filters): Promise<HistoryRecord[]> => {
    // make query params from filters
    const queryParams = new URLSearchParams(filters as unknown as Record<string, string>).toString();
    const request = await fetch(`/api/attendance-history?${queryParams}`);
    return await request.json();
  },
  getById: async (id: number): Promise<HistoryRecord> => {
    const request = await fetch(`/api/attendance-history/${id}`);
    return await request.json();
  },
  create: async (discipline: HistoryRecordBody) => {
    const response = await fetch('/api/attendance-history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discipline),
    });

    return response.json();
  },
};

export { attendanceHistoryApi };
