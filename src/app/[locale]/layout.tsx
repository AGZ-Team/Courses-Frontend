import {NextIntlClientProvider} from 'next-intl';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {routing, isLocale} from '@/i18n/routing';
import MainNavbar from '@/components/Navbar/MainNavbar';
import {Cairo, Jost} from 'next/font/google';
import ConditionalFooter from '@/components/Footer/ConditionalFooter';
import ArrowBtn from '@/components/Home/arrowBtn';
import BreadCrumb from '@/components/BreadCrumb';

const cairo = Cairo({subsets: ['arabic', 'latin'], variable: '--font-cairo', preload: false});
const jost = Jost({subsets: ['latin'], variable: '--font-jost', preload: false});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export const metadata: Metadata = {
  // Set base URL for resolving relative URLs in metadata (production URL or fallback to localhost)
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  // Use the project logo for icons and social images
  icons: {
    icon: '/logo/Logo.png',
    shortcut: '/logo/Logo.png',
    apple: '/logo/Logo.png',
  },
  openGraph: {
    images: [
      {
        url: '/logo/Logo.png',
        alt: 'Site logo',
      },
    ],
  },
  twitter: {
    images: ['/logo/Logo.png'],
  },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const fontClass = locale === 'ar' ? cairo.className : jost.className;

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`min-h-screen ${fontClass}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <header>
            <MainNavbar />
            <BreadCrumb />
          </header>
          <main>{children}</main>
      <ConditionalFooter />
      <ArrowBtn />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
