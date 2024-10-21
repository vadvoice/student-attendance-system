import { useQuery } from '@tanstack/react-query';
import { attendanceHistoryApi } from '@/lib/api/class-log.api';

const useHistoryRecords = () => {
  return useQuery({
    queryKey: ['historyRecords'],
    queryFn: () => attendanceHistoryApi.list(),
  });
};


export default useHistoryRecords;