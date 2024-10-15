import StudentParticipant from '@/components/student-participant';
import Head from 'next/head';

export default async function Share() {
  const title = 'Share Attendance System';
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
        <StudentParticipant />
        </div>
      </div>
    </>
  );
}
