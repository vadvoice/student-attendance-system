type SignUpResponse = {
  user: {
    id: string;
    email: string;
    created_at: string;
  } | null;
  session: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  } | null;
  error: {
    message: string;
  } | null;
};

export type { SignUpResponse };
