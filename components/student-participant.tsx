'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { studentApi } from '@/lib/api/student.api';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { attendanceHistoryApi } from '@/lib/api/class-log.api';
import { Spinner } from './spinner';

export default function StudentParticipant() {
  const searchParams = useSearchParams();
  const id = Number(searchParams.get('id'));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { data: attendenceHistoryRecord, isLoading } = useQuery({
    queryKey: ['attendenceHistoryRecord', id],
    queryFn: () => attendanceHistoryApi.getById(id),
  });

  const mutation = useMutation({
    mutationFn: () => studentApi.signUp(id),
    onSuccess: () => {
      setSuccess(true);
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
      setSuccess(false);
    },
  });

  if (isLoading) return <Spinner />;

  return (
    <div className="max-w-md mx-auto mt-8 p-6 rounded-lg shadow-md border border-gray-200">
      You are signing up for: <br />
      <h4 className="text-lg font-bold mb-4">{attendenceHistoryRecord?.name}</h4>
      {error && (
        <Alert variant="error" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="info" className="mb-4">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>You have successfully signed up for this event!</AlertDescription>
        </Alert>
      )}
      <Button
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending || success}
        className="w-full"
      >
        {mutation.isPending ? (
          <>
            <Spinner />
            Signing up...
          </>
        ) : (
          'Sign up'
        )}
      </Button>
    </div>
  );
}
