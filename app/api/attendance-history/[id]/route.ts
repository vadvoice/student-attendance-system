import { deleteHistoryRecord, getHistoryRecordById } from '@/utils/supabase/queries/class-log.query';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

const GET = async (req: Request, { params }: { params: { id: string } }) => {
  const { id } = params;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { data, error } = await getHistoryRecordById({ supabaseClient: supabase, recordId: Number(id) });
  if (error) return NextResponse.json({ error: error }, { status: 500 });
  return NextResponse.json(data);
};

const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
  const { id } = params;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { data, error } = await deleteHistoryRecord({ supabaseClient: supabase, recordId: Number(id), userId: user.id });
  return NextResponse.json(data);
};

export { GET, DELETE };
