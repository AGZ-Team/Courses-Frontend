import {getTranslations, setRequestLocale} from 'next-intl/server';

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'metadata.privacy'});

  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function PrivacyPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'privacy'});
  const highlights = [
    {
      title: t('highlights.0.title'),
      description: t('highlights.0.description')
    },
    {
      title: t('highlights.1.title'),
      description: t('highlights.1.description')
    },
    {
      title: t('highlights.2.title'),
      description: t('highlights.2.description')
    }
  ];

  const policySections = [
    {
      title: t('sections.infoCollect.title'),
      paragraphs: [
        t('sections.infoCollect.paragraphs.0'),
        t('sections.infoCollect.paragraphs.1')
      ]
    },
    {
      title: t('sections.howWeUse.title'),
      paragraphs: [
        t('sections.howWeUse.paragraphs.0'),
        t('sections.howWeUse.paragraphs.1')
      ]
    },
    {
      title: t('sections.sharing.title'),
      paragraphs: [
        t('sections.sharing.paragraphs.0'),
        t('sections.sharing.paragraphs.1')
      ]
    },
    {
      title: t('sections.dataRetention.title'),
      paragraphs: [
        t('sections.dataRetention.paragraphs.0'),
        t('sections.dataRetention.paragraphs.1')
      ]
    },
    {
      title: t('sections.international.title'),
      paragraphs: [
        t('sections.international.paragraphs.0')
      ]
    },
    {
      title: t('sections.yourRights.title'),
      paragraphs: [
        t('sections.yourRights.paragraphs.0'),
        t('sections.yourRights.paragraphs.1')
      ]
    }
  ];

  return (
    <main className="w-full bg-white pb-28 pt-28 sm:pb-36 sm:pt-32">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[40px] bg-[#120a5d] px-6 py-16 text-white shadow-[0_28px_60px_rgba(18,10,93,0.28)] sm:px-10">
          <div className="absolute -top-32 right-10 h-72 w-72 rounded-full bg-[#44ffae]/20 blur-3xl" aria-hidden />
          <div className="absolute -bottom-20 left-0 h-64 w-64 rounded-full bg-[#6c63ff]/30 blur-3xl" aria-hidden />
          <div className="relative z-10 space-y-6">
            <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-1 text-sm font-semibold tracking-[0.22em] text-white/80">
              {t('badge')}
            </span>
            <h1 className="text-[2.8rem] font-semibold leading-tight sm:text-[3.1rem]">
              {t('title')}
            </h1>
            <p className="max-w-3xl text-[18px] leading-8 text-white/85">
              {t('subtitle')}
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {highlights.map((highlight, idx) => (
            <div key={idx} className="group h-full rounded-2xl border border-[#e5e7fb] bg-white p-6 shadow-[0_16px_40px_rgba(18,10,93,0.05)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(18,10,93,0.12)]">
              <h2 className="text-[20px] font-semibold text-[#120a5d]">{highlight.title}</h2>
              <p className="mt-3 text-[15px] leading-7 text-[#5f5c7b]">{highlight.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 space-y-16">
          {policySections.map((section, idx) => (
            <section key={idx} className="space-y-5">
              <h2 className="text-[1.9rem] font-semibold text-[#140a5b]">{section.title}</h2>
              <div className="space-y-4 text-[16px] leading-7 text-[#4c4a63]">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-24 grid gap-8 rounded-4xl border border-[#e5e7fb] bg-[#f8f7ff] p-8 sm:grid-cols-[1.1fr_0.9fr] sm:p-10">
          <div className="space-y-4">
            <h2 className="text-[1.6rem] font-semibold text-[#120a5d]">{t('ctaBox.title')}</h2>
            <p className="text-[15px] leading-7 text-[#5f5c7b]">
              {t('ctaBox.description')}
            </p>
            <a
              href="mailto:privacy@educrat.com"
              className="inline-flex items-center justify-center rounded-full bg-[#4b35f5] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_18px_40px_rgba(75,53,245,0.35)] transition hover:bg-[#3420d9]"
            >
              {t('ctaBox.button')}
            </a>
          </div>
          <div className="space-y-3 rounded-2xl border border-white/40 bg-white/60 p-6 text-[14px] text-[#4c4a63] shadow-[0_18px_40px_rgba(18,10,93,0.08)]">
            <h3 className="text-[16px] font-semibold text-[#120a5d]">{t('ctaBox.quickAccess.title')}</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-[#44ffae]" aria-hidden />
                {t('ctaBox.quickAccess.items.0')}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-[#4b35f5]" aria-hidden />
                {t('ctaBox.quickAccess.items.1')}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-[#ff9f43]" aria-hidden />
                {t('ctaBox.quickAccess.items.2')}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
