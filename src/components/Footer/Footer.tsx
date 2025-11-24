"use client";

import Image from "next/image";
import LanguageSwitcher from "@/components/Navbar/LanguageSwitcher";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const KSA_Flag = "/svgs/ksa.svg";
const FacebookIcon = "/svgs/footer/facebook.svg";
const XIcon = "/svgs/footer/X.svg";
const InstagramIcon = "/svgs/footer/instagram.svg";
const LinkedInIcon = "/svgs/footer/linkedin.svg";
const FOOTER_LINK_GROUPS = [
  {
    key: "home",
    links: [
      { key: "heroSection", href: "/" },
      { key: "popularCreators", href: "/#popular-creators" },
      { key: "testimonials", href: "/#testimonials" },
      { key: "newsletter", href: "/#newsletter" },
      { key: "becomeCreator", href: "/signup" },
    ],
  },
  {
    key: "creators",
    links: [
      { key: "featuredCreators", href: "/creators" },
      { key: "topCreators", href: "/creators?sort=top" },
      { key: "newCreators", href: "/creators?sort=new" },
    ],
  },
  {
    key: "explore",
    links: [
      { key: "art", href: "/courses?category=art" },
      { key: "education", href: "/courses?category=education" },
      { key: "gaming", href: "/courses?category=gaming" },
      { key: "lifestyle", href: "/courses?category=lifestyle" },
      { key: "allCategories", href: "/courses" },
    ],
  },
  {
    key: "aboutUs",
    links: [
      { key: "mission", href: "/about#how-it-works" },
      { key: "team", href: "/about#learning-journey" },
      { key: "values", href: "/about#testimonials" },
      { key: "careers", href: "/about#join-us" },
    ],
  },
  {
    key: "privacy",
    links: [
      { key: "privacyPolicy", href: "/privacy" },
      { key: "termsOfService", href: "/terms#terms" },
      { key: "cookiePolicy", href: "/privacy#cookies" },
      { key: "dataProtection", href: "/privacy#data-protection" },
    ],
  },
] as const;

const SOCIAL_LINKS = [
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "x", href: "#", icon: XIcon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "LinkedIn", href: "#", icon: LinkedInIcon },
] as const;

const Footer = () => {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0ABAB5] text-white">
      <div className="mx-auto w-full max-w-[1180px] px-6 pb-16 pt-10 sm:px-8 md:px-10 lg:px-12 min-[1000px]:max-[1399px]:px-1 min-[1400px]:px-16 min-[1400px]:max-w-[1400px]">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-12" data-aos="fade-up" data-aos-duration="600">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image src="/logo/Logo.png" alt="Logo" width={200} height={60} className="h-12 md:h-14 w-auto" />
            </div>

            <div className="space-y-2">
              <p className="text-[13px] text-white font-semibold">{t("socialPrompt")}</p>
              <div className="flex items-center gap-4">
                {SOCIAL_LINKS.map(({ label, href, icon }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={t(`social.${label.toLowerCase()}`)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/40 text-white/70 hover:bg-white transition hover:text-[#0ABAB5]"
                  >
                    <Image src={icon} alt={label} width={20} height={20} className="h-7 w-7" aria-hidden />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <p className="text-[15px] max-w-full sm:max-w-[calc(100%-24rem)] lg:max-w-[calc(100%-35rem)] leading-relaxed text-white/90">{t("tagline")}</p>
        </div>

        <div className="footer-grid mt-12 grid gap-10 grid-cols-2 max-[480px]:grid-cols-1 sm:grid-cols-3 md:grid-cols-7 min-[1000px]:max-1399px:grid-cols-4" data-aos="fade-up" data-aos-duration="700">
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
            <h3 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">{t("support.title")}</h3>
            <ul className="space-y-3 text-[13px] text-white font-semibold">
              <li>
                <Link href={t("support.contactUsHref")} className="transition hover:text-white/80 hover:underline">
                  {t("support.contactUs")}
                </Link>
              </li>
              <li>
                <Link href="/contact#faq" className="transition hover:text-white/80 hover:underline">
                  {t("support.faq")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-5 min-w-[220px]">
            <h3 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">{t("newsletter.title")}</h3>
            <p className="text-[13px] text-white/70">{t("newsletter.subtitle")}</p>
            <form className="flex flex-col gap-3" onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="footer-email" className="sr-only">
                {t("newsletter.emailLabel")}
              </label>
              <input
                id="footer-email"
                type="email"
                required
                placeholder={t("newsletter.placeholder")}
                className="w-full rounded-lg border border-white/15 bg-white/5 py-3 px-4 text-[13px] text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none transition"
              />
              <button
                type="submit"
                className="ms-auto inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-[13px] font-semibold text-[#0ABAB5] transition hover:bg-white/90"
              >
                {t("newsletter.submit")}
              </button>
            </form>
          </div>
        </div>

        <div
          className="mt-12 flex flex-col font-semibold gap-6 border-t border-white/10 pt-8 text-[14px] text-white md:flex-row md:items-center md:justify-between"
          data-aos="fade-up"
          data-aos-duration="700"
        >
          <p>
            {t("copyright", { year })} {/* <span className="mx-2">•</span> */}
            {t("madeInSaudi")} <Image src={KSA_Flag} alt="KSA Flag" width={27} height={27} className="inline-block" />
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <Link href="/terms" className="transition hover:text-white/80">
              {t("legalLinks.terms")}
            </Link>
            <Link href="/privacy" className="transition hover:text-white/80">
              {t("legalLinks.privacy")}
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
