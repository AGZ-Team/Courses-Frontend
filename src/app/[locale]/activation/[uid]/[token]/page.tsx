import { redirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ locale: string; uid: string; token: string }>;
};

export default async function LocalizedActivationPage({ params }: PageProps) {
  const { locale, uid, token } = await params;
  
  // Redirect to the frontend verification page with uid and token
  // Preserves the user's locale preference
  redirect(`/${locale}/auth/verify-email/${uid}/${token}`);
}
