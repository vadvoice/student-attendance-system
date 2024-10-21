import { useState } from 'react';
import useHistoryRecords from '@/hooks/use-history-records';
import { Spinner } from './spinner';
import { Alert } from './ui/alert';
import { HistoryRecord } from '@/types/HistoryRecord';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

const HistoryRecordItem = ({ record }: { record: HistoryRecord }) => {
  const [isOpen, setIsOpen] = useState(false);
  return <div className={cn('border p-2 rounded-md flex justify-between items-center gap-2 cursor-pointer transition-colors duration-200', isOpen ? 'bg-muted' : '')}>
    <div className="flex flex-col items-start gap-2">
      <strong>{record.name}</strong>
      {
        isOpen && <div className="flex flex-col gap-2 text-sm">
          <p>Discipline: {record.discipline_id}</p>
          <p>Date: {formatDate(record.created_at)}</p>
          <p>Participants: {record.students_participated}</p>
        </div>
      }
    </div>

    <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)}>
      {isOpen ? <ChevronUp /> : <ChevronDown />}
    </Button>
  </div>;
};

const RecordsHistory = () => {
  const { data: historyRecords, isLoading: historyRecordsIsLoading } = useHistoryRecords();

  if (historyRecordsIsLoading) return <Spinner />;
  if (!historyRecords) return null;

  return <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto p-4">
    {!historyRecords.length && !historyRecordsIsLoading ? <Alert>No records found</Alert> : null}
    {historyRecords.map((record) => <HistoryRecordItem record={record} />)}
  </div>;
};

export default RecordsHistory;
