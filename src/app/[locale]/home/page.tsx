import { permanentRedirect } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocaleHomeAlias({ params }: PageProps) {
  const { locale } = await params;

  // Redirect /en/home or /ar/home back to the locale root (e.g. /en, /ar)
  permanentRedirect(`/${locale}`);
}
