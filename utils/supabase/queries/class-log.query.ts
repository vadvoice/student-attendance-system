import { Filters, HistoryRecordBody } from '@/types/HistoryRecord';
import { SupabaseClient } from '@supabase/supabase-js';

interface QueryParams {
  supabaseClient: SupabaseClient;
  userId: string;
  filters?: Filters;
}

interface CreateHistoryRecordParams extends QueryParams {
  historyRecord: HistoryRecordBody;
}

interface DeleteHistoryRecordParams extends QueryParams {
  recordId: number;
}

interface GetHistoryRecordByIdParams {
  supabaseClient: SupabaseClient;
  recordId: number;
}

interface ClassSignUpParams extends QueryParams {
  id: number;
}

// Get all history records for a user
const getHistoryRecords = async ({ supabaseClient, userId, filters }: QueryParams) => {
  let query = supabaseClient
    .from('class_log')
    .select('*')
    .eq('author_id', userId);

  if (filters?.historyFilter) {
    query = query.eq('discipline_id', filters.historyFilter);
  }

  if (filters?.date) {
    console.log(filters.date.toDateString());
    // date comparison without timezone
    query = query.gt('created_at', filters.date.toDateString());
  }

  try {
    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

const getHistoryRecordById = async ({ supabaseClient, recordId }: GetHistoryRecordByIdParams) => {
  try {
    const { data, error } = await supabaseClient
      .from('class_log')
      .select('*')
      .eq('id', recordId);

    if (error) throw error;
    return { data: data[0], error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Create a new history record
const createHistoryRecord = async ({ supabaseClient, historyRecord }: CreateHistoryRecordParams) => {
  try {
    const { data, error } = await supabaseClient
      .from('class_log')
      .insert(historyRecord)
      .select();

    if (error) throw error;

    return { data: data[0], error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Delete a history record
const deleteHistoryRecord = async ({ supabaseClient, recordId }: DeleteHistoryRecordParams) => {
  try {
    const { data, error } = await supabaseClient
      .from('class_log')
      .delete()
      .eq('id', recordId)
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Sign up a user for attendance
const signUpForAttendance = async ({ supabaseClient, id }: ClassSignUpParams) => {
  try {

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const userId = user.id;

    // before creating check if that user has already signed up for that attendance
    const { data: isSignedUp, error: isSignedUpError } = await supabaseClient
      .from('participants')
      .select('*')
      .eq('class_log_id', id)
      .eq('student_id', userId)
      .single();

    if (isSignedUp) throw new Error('Already signed up for attendance');

    // First, get the current attendance count
    const { data: currentData, error: fetchError } = await supabaseClient
      .from('class_log')
      .select('students_participated')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;
    if (!currentData) throw new Error('No data found');

    // Then, update the attendance count
    const { data: updatedData, error: updateError } = await supabaseClient
      .from('class_log')
      .update({ students_participated: currentData.students_participated + 1 })
      .eq('id', id)
      .select();

    // create participant record
    const { data: participantData, error: participantError } = await supabaseClient
      .from('participants')
      .insert({
        class_log_id: id,
        student_id: userId,
      })
      .select();

    if (updateError) throw updateError;
    return { data: updatedData, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export { getHistoryRecords, createHistoryRecord, deleteHistoryRecord, signUpForAttendance, getHistoryRecordById };
