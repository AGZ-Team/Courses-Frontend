import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

type PageProps = {
  params: Promise<{ uid: string; token: string }>;
  searchParams?: Promise<{ locale?: string; lang?: string }>;
};

export default async function ActivationPage({ 
  params, 
  searchParams 
}: PageProps) {
  const { uid, token } = await params;
  const sp = await searchParams;
  
  // Try to get locale from multiple sources (in order of priority):
  // 1. Query parameter (?locale=ar or ?lang=ar)
  // 2. Cookie preference
  // 3. Default to 'en'
  let locale = sp?.locale || sp?.lang;
  
  if (!locale) {
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get('NEXT_LOCALE');
    locale = localeCookie?.value || 'en';
  }
  
  // Ensure locale is valid (either 'en' or 'ar')
  if (locale !== 'en' && locale !== 'ar') {
    locale = 'en';
  }
  
  // Redirect to the frontend verification page with uid and token
  // This handles both /activation/[uid]/[token] and /locale/activation/[uid]/[token] links from backend
  redirect(`/${locale}/auth/verify-email/${uid}/${token}`);
}
