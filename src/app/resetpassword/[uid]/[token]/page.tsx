import { redirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ uid: string; token: string }>;
};

export default async function ResetPasswordPage({ params }: PageProps) {
  const { uid, token } = await params;
  
  // Redirect to the frontend reset password page with uid and token
  // Default to English locale, user can change it in the UI
  redirect(`/en/auth/reset-password/${uid}/${token}`);
}
