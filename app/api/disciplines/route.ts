import { createClient } from '@/utils/supabase/server';
import {
  getDisciplines,
  createDiscipline,
} from '@/utils/supabase/queries/desciplines.query';
import { DisciplineBody } from '@/types/Discipline';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await getDisciplines(supabase, user.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
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

  const { name, description } = (await request.json()) as DisciplineBody;
  const { data, error } = await createDiscipline(supabase, {
    name,
    description,
    author_id: user.id,
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
