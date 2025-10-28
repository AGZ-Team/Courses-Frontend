import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {Geist, Geist_Mono} from 'next/font/google';
import {routing, isLocale} from '@/i18n/routing';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const geistSans = Geist({subsets: ['latin'], variable: '--font-geist-sans'});
const geistMono = Geist_Mono({subsets: ['latin'], variable: '--font-geist-mono'});

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

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground antialiased" suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="min-h-screen">
            <header className="flex items-center justify-end gap-4 border-b border-zinc-200 bg-white px-6 py-4 shadow-sm">
              <LanguageSwitcher />
            </header>
            <main className="px-6 py-12">{children}</main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
