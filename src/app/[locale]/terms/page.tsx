import {getTranslations, setRequestLocale} from 'next-intl/server';

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'metadata.terms'});

  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function TermsPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'terms'});

  const termsSections = [
    {
      title: t('sections.usingServices.title'),
      paragraphs: [
        t('sections.usingServices.paragraphs.0'),
        t('sections.usingServices.paragraphs.1')
      ]
    },
    {
      title: t('sections.yourContent.title'),
      paragraphs: [
        t('sections.yourContent.paragraphs.0'),
        t('sections.yourContent.paragraphs.1')
      ]
    },
    {
      title: t('sections.subscriptions.title'),
      paragraphs: [
        t('sections.subscriptions.paragraphs.0'),
        t('sections.subscriptions.paragraphs.1')
      ]
    },
    {
      title: t('sections.termination.title'),
      paragraphs: [
        t('sections.termination.paragraphs.0'),
        t('sections.termination.paragraphs.1')
      ]
    },
    {
      title: t('sections.changes.title'),
      paragraphs: [
        t('sections.changes.paragraphs.0'),
        t('sections.changes.paragraphs.1')
      ]
    },
    {
      title: t('sections.contact.title'),
      paragraphs: [
        t('sections.contact.paragraphs.0')
      ]
    }
  ];

  return (
    <main className="w-full bg-white pb-24 pt-28 sm:pb-32 sm:pt-32">
      <div className="mx-auto max-w-[1080px] px-4 sm:px-6">
        <div className="text-center">
          <span className="text-2xl font-semibold uppercase tracking-[0.28em] text-primary">{t('badge')}</span>
          <h1 className="mt-6 text-[2.75rem] font-semibold text-slate-900 sm:text-[3rem]">{t('title')}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-relaxed text-slate-700 sm:text-[18px]">
            {t('subtitle')}
          </p>
        </div>

        <div className="mt-16 space-y-16">
          {termsSections.map((section, idx) => (
            <section key={idx} className="space-y-5">
              <h2 className="text-[1.75rem] font-semibold text-primary">{section.title}</h2>
              <div className="space-y-4 text-[16px] leading-7 text-slate-700">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-20 rounded-3xl border border-primary/20 bg-white p-8 shadow-sm sm:p-10">
          <h2 className="text-[1.5rem] font-semibold text-slate-900">{t('helpBox.title')}</h2>
          <p className="mt-3 text-[15px] leading-7 text-slate-700">
            {t('helpBox.description')} <a className="font-semibold text-primary underline-offset-4 hover:underline" href="mailto:support@educrat.com">{t('helpBox.email')}</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
