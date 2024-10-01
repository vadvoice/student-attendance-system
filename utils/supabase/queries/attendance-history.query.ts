import { HistoryRecordBody } from '@/types/HistoryRecord';
import { SupabaseClient } from '@supabase/supabase-js';

// attendance_history table queries
const getHistoryRecords = async (supabase: SupabaseClient, user_id: string) => {
  return supabase.from('attendance_history').select('*').eq('author_id', user_id);
};
const createHistoryRecord = async (
  supabase: SupabaseClient,
  historyRecord: HistoryRecordBody
) => {
  return supabase.from('attendance_history').insert(historyRecord).select();
};
const deleteHistoryRecord = async (supabase: SupabaseClient, id: number) => {
  return supabase.from('attendance_history').delete().eq('id', id).select();
};


export { getHistoryRecords, createHistoryRecord, deleteHistoryRecord };
