import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { signUpForAttendance } from '@/utils/supabase/queries/class-log.query';

export async function POST(request: Request) {
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
  }

  const supabase = createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await signUpForAttendance({ supabaseClient: supabase, userId: user.id, id });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}