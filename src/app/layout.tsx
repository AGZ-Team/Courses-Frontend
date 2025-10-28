import './globals.css';
import {getLocale, getTranslations} from 'next-intl/server';
import {Geist, Geist_Mono} from 'next/font/google';

const geistSans = Geist({subsets: ['latin'], variable: '--font-geist-sans'});
const geistMono = Geist_Mono({subsets: ['latin'], variable: '--font-geist-mono'});

type Props = {
  children: React.ReactNode;
};


export default async function RootLayout({children}: Props) {
  const locale = await getLocale();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
