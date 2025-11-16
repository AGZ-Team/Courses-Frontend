import {NextIntlClientProvider} from 'next-intl';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {routing, isLocale} from '@/i18n/routing';
import ConditionalNavbar from '@/components/Navbar/ConditionalNavbar';
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
  metadataBase: new URL('https://crai-ksa.netlify.app'),
  title: 'C R A I - Online Learning Platform',
  description: 'A Saudi platform connecting creators and supporters through exclusive content, meaningful communities, and real opportunity.',
  // Use the project logo for icons and social images
  icons: {
    icon: {url: '/logo/c.jpg', sizes: '512x512'},
    shortcut: {url: '/logo/c.jpg', sizes: '512x512'},
    apple: {url: '/logo/c.jpg', sizes: '512x512'},
  },
  openGraph: {
    type: 'website',
    url: 'https://crai-ksa.netlify.app',
    siteName: 'C R A I',
    title: 'C R A I - Online Learning Platform',
    description: 'A Saudi platform connecting creators and supporters through exclusive content, meaningful communities, and real opportunity.',
    images: [
      {
        url: 'https://crai-ksa.netlify.app/logo/metaLogo.png',
        width: 1200,
        height: 630,
        alt: 'C R A I Logo',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'C R A I - Online Learning Platform',
    description: 'A Saudi platform connecting creators and supporters through exclusive content, meaningful communities, and real opportunity.',
    images: ['https://crai-ksa.netlify.app/logo/metaLogo.png'],
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
            <ConditionalNavbar />
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
