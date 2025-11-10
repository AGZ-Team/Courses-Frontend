'use client';

import {FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter} from 'react-icons/fa';
import LanguageSwitcher from '@/components/Navbar/LanguageSwitcher';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';

const FOOTER_LINK_GROUPS = [
  {
    key: 'home',
    links: [
      {key: 'heroSection', href: '/'},
      {key: 'popularCourses', href: '/#popular-courses'},
      {key: 'testimonials', href: '/#testimonials'},
      {key: 'newsletter', href: '/#newsletter'},
      {key: 'becomeCreator', href: '/signup'}
    ]
  },
  {
    key: 'creators',
    links: [
      {key: 'featuredCreators', href: '/creators'},
      {key: 'topCreators', href: '/creators?sort=top'},
      {key: 'newCreators', href: '/creators?sort=new'}
    ]
  },
  {
    key: 'explore',
    links: [
      {key: 'art', href: '/courses?category=art'},
      {key: 'education', href: '/courses?category=education'},
      {key: 'gaming', href: '/courses?category=gaming'},
      {key: 'lifestyle', href: '/courses?category=lifestyle'},
      {key: 'allCategories', href: '/courses'}
    ]
  },
  {
    key: 'aboutUs',
    links: [
      {key: 'mission', href: '/about#how-it-works'},
      {key: 'team', href: '/about#learning-journey'},
      {key: 'values', href: '/about#testimonials'},
      {key: 'careers', href: '/about#join-us'}
    ]
  },
  {
    key: 'privacy',
    links: [
      {key: 'privacyPolicy', href: '/privacy#policy'},
      {key: 'termsOfService', href: '/terms#terms'},
      {key: 'cookiePolicy', href: '/privacy#cookies'},
      {key: 'dataProtection', href: '/privacy#data-protection'}
    ]
  }
] as const;

const SOCIAL_LINKS = [
  {label: 'Facebook', href: '#', Icon: FaFacebookF},
  {label: 'Twitter', href: '#', Icon: FaTwitter},
  {label: 'Instagram', href: '#', Icon: FaInstagram},
  {label: 'LinkedIn', href: '#', Icon: FaLinkedinIn}
] as const;

const Footer = () => {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0ABAB5] text-white">
      <div className="mx-auto w-full max-w-[1180px] px-4 pb-16 pt-10 sm:px-6">
        <div
          className="flex flex-col gap-6 border-b border-white/10 pb-12"
          data-aos="fade-up"
          data-aos-duration="600"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-7 w-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 8.5 12 5l9 3.5-9 3.5-9-3.5Z" />
                  <path d="M7 11v5l5 3 5-3v-5" />
                  <path d="M12 12.5v6" />
                </svg>
              </span>
              <span className="text-[28px] font-semibold">{t('brandName')}</span>
            </div>

            <div className="space-y-2">
              <p className="text-[13px] text-white font-semibold">{t('socialPrompt')}</p>
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map(({label, href, Icon}) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={t(`social.${label.toLowerCase()}`)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 transition hover:bg-white hover:text-[#0ABAB5]"
                  >
                    <Icon className="h-[15px] w-[15px]" aria-hidden />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <p className="text-[15px] max-w-[calc(100%-35rem)] leading-relaxed text-white/90">{t('tagline')}</p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-7" data-aos="fade-up" data-aos-duration="700">
          {FOOTER_LINK_GROUPS.map((group) => (
            <div key={group.key} className="space-y-5 min-w-[180px]">
              <h3 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">
                {t(`linkGroups.${group.key}.title`)}
              </h3>
              <ul className="space-y-3 text-[13px] text-white font-semibold">
                {group.links.map((link) => (
                  <li key={link.key}>
                    <Link href={link.href} className="transition hover:text-white/80 hover:underline">
                      {t(`linkGroups.${group.key}.${link.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-5 min-w-[180px]">
            <h3 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">{t('support.title')}</h3>
            <ul className="space-y-3 text-[13px] text-white font-semibold">
              <li>
                <Link href={t('support.contactUsHref')} className="transition hover:text-white/80 hover:underline">
                  {t('support.contactUs')}
                </Link>
              </li>
              <li>
                <Link href="/contact#faq" className="transition hover:text-white/80 hover:underline">
                  {t('support.faq')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-5 min-w-[220px]">
            <h3 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">{t('newsletter.title')}</h3>
            <p className="text-[13px] text-white/70">{t('newsletter.subtitle')}</p>
            <form
              className="flex flex-col gap-3"
              onSubmit={(event) => event.preventDefault()}
            >
              <label htmlFor="footer-email" className="sr-only">
                {t('newsletter.emailLabel')}
              </label>
              <input
                id="footer-email"
                type="email"
                required
                placeholder={t('newsletter.placeholder')}
                className="w-full rounded-lg border border-white/15 bg-white/5 py-3 px-4 text-[13px] text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none transition"
              />
              <button
                type="submit"
                className="ms-auto inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-[13px] font-semibold text-[#0ABAB5] transition hover:bg-white/90"
              >
                {t('newsletter.submit')}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col font-semibold gap-6 border-t border-white/10 pt-8 text-[14px] text-white md:flex-row md:items-center md:justify-between" data-aos="fade-up" data-aos-duration="700">
          <p>
            {t('copyright', {year})}
            <span className="mx-2">•</span>
            {t('madeInSaudi')}
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <Link href="/terms" className="transition hover:text-white/80">
              {t('legalLinks.terms')}
            </Link>
            <Link href="/privacy" className="transition hover:text-white/80">
              {t('legalLinks.privacy')}
            </Link>

            <div className="inline-flex items-center rounded-full border border-white/20 p-1 transition hover:border-white/40">
              <LanguageSwitcher placement="up" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
