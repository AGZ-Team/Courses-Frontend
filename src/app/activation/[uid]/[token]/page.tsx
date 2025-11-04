import { redirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ uid: string; token: string }>;
};

export default async function ActivationPage({ params }: PageProps) {
  const { uid, token } = await params;
  
  // Redirect to the frontend verification page with uid and token
  // This handles both /activation/[uid]/[token] and /en/activation/[uid]/[token] links from backend
  redirect(`/en/auth/verify-email/${uid}/${token}`);
}
