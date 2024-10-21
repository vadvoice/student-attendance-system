import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import {
  getHistoryRecords,
  createHistoryRecord,
} from '@/utils/supabase/queries/class-log.query';
import { Filters, HistoryRecordBody } from '@/types/HistoryRecord';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const historyFilter = searchParams.get('historyFilter');
  const date = searchParams.get('date');
  let filters: Filters = {};
  if (historyFilter) filters.historyFilter = historyFilter;
  if (date) filters.date = new Date(date);

  const { data, error } = await getHistoryRecords({ supabaseClient: supabase, userId: user.id, filters });

  if (error)
    return NextResponse.json({ error: error }, { status: 500 });

  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = (await request.json()) as HistoryRecordBody;

  const historyRecord = {
    ...body,
    author_id: user.id,
  };

  const { data, error } = await createHistoryRecord({ supabaseClient: supabase, userId: user.id, historyRecord });

  if (error)
    return NextResponse.json({ error: error }, { status: 500 });

  return NextResponse.json(data, { status: 201 });
}
