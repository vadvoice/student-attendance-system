import { SignUpResponse } from '@/types/SignUpResponse';

export const studentApi = {
  signUp: async (id: number): Promise<SignUpResponse> => {
    const response = await fetch('/api/student/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || 'Failed to sign up');
    }

    return response.json();
  },
};
