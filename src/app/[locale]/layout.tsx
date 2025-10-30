import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {routing, isLocale} from '@/i18n/routing';
import MainNavbar from '@/components/Navbar/MainNavbar';
import {Cairo} from 'next/font/google';
import Footer from '@/components/Footer';
import ArrowBtn from '@/components/Home/arrowBtn';

const cairo = Cairo({subsets: ['arabic', 'latin'], variable: '--font-cairo'});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

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
  const fontClass = locale === 'ar' ? cairo.className : '';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={`min-h-screen ${fontClass}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <header>
            <MainNavbar />
          </header>
          <main>{children}</main>
      <Footer />

      <ArrowBtn />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
