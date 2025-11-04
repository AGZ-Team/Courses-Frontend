import { redirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ locale: string; uid: string; token: string }>;
};

export default async function LocalizedResetPasswordPage({ params }: PageProps) {
  const { locale, uid, token } = await params;
  
  // Redirect to the frontend reset password page with uid and token
  // Preserves the user's locale preference
  redirect(`/${locale}/auth/reset-password/${uid}/${token}`);
}
