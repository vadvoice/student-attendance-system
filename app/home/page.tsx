import { AttendanceSystem } from '@/components/attendance-system';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import App from '../_app';

export default async function HomePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <App>
        <AttendanceSystem />
      </App>
    </div>
  );
}
