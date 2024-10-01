type HistoryRecordBody = {
  name: string;
  discipline_id: number;
};

type HistoryRecord = {
  id: number;
  name: string;
  discipline_id: number;
  author_id: string;
  created_at: string;
  updated_at: string;
};

export type { HistoryRecordBody, HistoryRecord };