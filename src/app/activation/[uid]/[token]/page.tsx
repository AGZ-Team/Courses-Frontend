import { redirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ uid: string; token: string }>;
};

export default async function ActivationPage({ params }: PageProps) {
  const { uid, token } = await params;
  
  // Redirect to the frontend verification page with uid and token
  // Default to English locale, user can change it in the UI
  redirect(`/en/auth/verify-email/${uid}/${token}`);
}
