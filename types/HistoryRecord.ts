type HistoryRecordBody = {
  name: string;
  discipline_id: number;
};

type HistoryRecord = {
  id: number;
  name: string;
  discipline_id: number;
  students_participated: number;
  author_id: string;
  created_at: string;
  updated_at: string;
};

type Filters = {
  historyFilter?: string;
  date?: Date;
};

export type { HistoryRecordBody, HistoryRecord, Filters };
