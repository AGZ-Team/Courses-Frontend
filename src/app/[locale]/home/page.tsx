import { redirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomeRedirect({ params }: PageProps) {
  const { locale } = await params;
  // Redirect /en/home to /en (or /ar/home to /ar)
  redirect(`/${locale}`);
}
