import { createClient } from '@/utils/supabase/server';
import { deleteDiscipline } from '@/utils/supabase/queries/desciplines.query';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = params.id;
  if (!id)
    return NextResponse.json({ error: 'Id is required' }, { status: 400 });

  const { data, error } = await deleteDiscipline(supabase, id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 200 });
}
