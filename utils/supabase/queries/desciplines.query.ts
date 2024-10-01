import { DisciplineBody } from '@/types/Discipline';
import { SupabaseClient } from '@supabase/supabase-js';

const getDisciplines = async (supabase: SupabaseClient, authorId: string) => {
  return supabase.from('disciplines').select().eq('author_id', authorId);
}

const createDiscipline = async (supabase: SupabaseClient, discipline: DisciplineBody) => {
  return supabase.from('disciplines').insert(discipline).select();
}

const deleteDiscipline = async (supabase: SupabaseClient, id: string) => {
  return supabase.from('disciplines').delete().eq('id', id).select();
}

export { getDisciplines, createDiscipline, deleteDiscipline };