import { getTranslations, setRequestLocale } from 'next-intl/server';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.privacy' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

const SECTIONS = [
    { id: 'introduction', key: 'introduction', items: 3 },
    { id: 'pricing', key: 'pricing', items: 4 },
    { id: 'information', key: 'information', items: 5 },
    { id: 'usage', key: 'usage', items: 5 },
    { id: 'sharing', key: 'sharing', items: 4 },
    { id: 'security', key: 'security', items: 4 },
    { id: 'rights', key: 'rights', items: 5 },
    { id: 'cookies', key: 'cookies', items: 4 },
    { id: 'international', key: 'international', items: 3 },
    { id: 'retention', key: 'retention', items: 3 },
    { id: 'changes', key: 'changes', items: 3 },
    { id: 'contact', key: 'contact', items: 3 },
];

const ICONS: Record<string, string> = {
    introduction: '/privacySvgs/people-who-support-svgrepo-com.svg',
    pricing: '/privacySvgs/pricing-tag-svgrepo-com.svg',
    information: '/privacySvgs/information-svgrepo-com.svg',
    usage: '/privacySvgs/data-analysis-svgrepo-com.svg',
    sharing: '/privacySvgs/people-who-support-svgrepo-com.svg',
    security: '/privacySvgs/security-svgrepo-com.svg',
    rights: '/privacySvgs/human-rights-svgrepo-com.svg',
    cookies: '/privacySvgs/cookie-svgrepo-com.svg',
    international: '/privacySvgs/international-svgrepo-com.svg',
    retention: '/privacySvgs/project-svgrepo-com.svg',
    changes: '/privacySvgs/change-request-svgrepo-com.svg',
    contact: '/privacySvgs/contact-phone-talking-svgrepo-com.svg',
};

export default async function PrivacyPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'privacyPolicy' });

    return (
        <main className="w-full bg-white pb-32 pt-28 sm:pb-40 sm:pt-32">
            {/* Hero Section */}
            <div className="mb-20 text-center">
                <span className="inline-block text-sm font-semibold uppercase tracking-widest text-primary">
                    {t('badge')}
                </span>
                <h1 className="mt-4 text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight tracking-normal wrap-break-word break-keep hyphens-none text-balance">
                    {t('title')}
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-900">
                    {t('subtitle')}
                </p>
            </div>

            {/* Content with far-left TOC */}
            <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 sm:px-6 lg:px-8 lg:items-start">
                {/* TOC - Far Left */}
                <aside className="hidden lg:sticky lg:top-28 lg:block w-52 shrink-0 pr-6 self-start">
                    <div className="h-fit">
                        <nav aria-label="On this page" className="text-[14px]">
                            <h3 className="mb-4 text-[15px] font-semibold text-slate-900">{t('badge')}</h3>
                            <ul className="space-y-2 text-slate-700">
                                {SECTIONS.map((s) => (
                                    <li key={s.id}>
                                        <a
                                            href={`#${s.id}`}
                                            className="block rounded-md px-3 py-2 font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                                        >
                                            {t(`sections.${s.key}.title`)}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </aside>

                {/* Main content - Centered */}
                <div className="flex-1 w-full max-w-3xl">
                    <div className="space-y-12">
                        {SECTIONS.map((section) => (
                            <section
                                key={section.id}
                                id={section.id}
                                className="group scroll-mt-32 transition-all duration-300"
                            >
                                <h2 className="mb-4 flex items-center gap-3 text-2xl font-semibold text-primary hover:text-primary/80 transition-colors">
                                    <img
                                        src={ICONS[section.key]}
                                        alt={`${section.key} icon`}
                                        width={28}
                                        height={28}
                                        className="rounded-full shadow-sm"
                                        loading="lazy"
                                    />
                                    {t(`sections.${section.key}.title`)}
                                </h2>
                                <div className="space-y-3 text-slate-700 break-normal">
                                    {Array.from({ length: section.items }).map((_, i) => {
                                        const key = `sections.${section.key}.items.${i}`;
                                        const text = t(key);
                                        return text && text !== key ? (
                                            <p
                                                key={i}
                                                className="flex gap-3 leading-relaxed text-[16px] whitespace-normal break-normal hover:text-primary/80 transition-colors duration-200"
                                            >
                                                <span className="mt-0.5 shrink-0 text-primary font-semibold">•</span>
                                                <span>{text}</span>
                                            </p>
                                        ) : null;
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <div className="mt-20 pt-12 border-t border-slate-200">
                        <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                            {t('cta.title')}
                        </h3>
                        <p className="text-slate-700 mb-6">{t('cta.description')}</p>
                        <a
                            href="mailto:privacy@cray.com"
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg"
                        >
                            {t('cta.button')}
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
