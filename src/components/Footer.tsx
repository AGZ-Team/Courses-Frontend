'use client';

import Image from 'next/image';
import Link from 'next/link';
import {FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter} from 'react-icons/fa';
import LanguageSwitcher from '@/components/Navbar/LanguageSwitcher';

const FOOTER_LINK_GROUPS = [
  {
    title: 'About',
    links: [
      {label: 'About Us', href: '/about'},
      {label: 'Learner Stories', href: '/blog'},
      {label: 'Careers', href: '/careers'},
      {label: 'Press', href: '/press'},
      {label: 'Leadership', href: '/leadership'},
      {label: 'Contact Us', href: '/contact'}
    ]
  },
  {
    title: 'Categories',
    links: [
      {label: 'Development', href: '/categories/development'},
      {label: 'Business', href: '/categories/business'},
      {label: 'Finance & Accounting', href: '/categories/finance'},
      {label: 'IT & Software', href: '/categories/it-software'},
      {label: 'Office Productivity', href: '/categories/office-productivity'},
      {label: 'Design', href: '/categories/design'},
      {label: 'Marketing', href: '/categories/marketing'}
    ]
  },
  {
    title: 'Others',
    links: [
      {label: 'Lifestyle', href: '/categories/lifestyle'},
      {label: 'Photography & Video', href: '/categories/photography-video'},
      {label: 'Health & Fitness', href: '/categories/health-fitness'},
      {label: 'Music', href: '/categories/music'},
      {label: 'UX Design', href: '/categories/ux-design'},
      {label: 'SEO', href: '/categories/seo'}
    ]
  },
  {
    title: 'Support',
    links: [
      {label: 'Documentation', href: '/support/documentation'},
      {label: 'FAQs', href: '/support/faqs'},
      {label: 'Dashboard', href: '/dashboard'},
      {label: 'Contact', href: '/contact'}
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
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#100b44] text-white">
      <div className="mx-auto w-full max-w-[1180px] px-4 pb-16 pt-10 sm:px-6">
        <div
          className="flex flex-col gap-8 border-b border-white/10 pb-12 md:flex-row md:items-center md:justify-between"
          data-aos="fade-up"
          data-aos-duration="600"
        >
          <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-7 w-7 text-emerald-400"
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
            <span className="text-[20px] font-semibold">Educrat</span>
          </div>

          <div className="space-y-3 text-right md:text-left">
            <p className="text-[14px] text-white/70">Follow us on social media</p>
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map(({label, href, Icon}) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition hover:-translate-y-[2px] hover:border-[#44ffae] hover:text-[#44ffae]"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-5" data-aos="fade-up" data-aos-duration="700">
          {FOOTER_LINK_GROUPS.map((group) => (
            <div key={group.title} className="space-y-5">
              <h3 className="text-[15px] font-semibold uppercase tracking-[0.18em] text-white/80">{group.title}</h3>
              <ul className="space-y-3 text-[14px] text-white/70">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition hover:text-[#44ffae]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-5 lg:col-span-1">
            <h3 className="text-[15px] font-semibold uppercase tracking-[0.18em] text-white/80">Get in touch</h3>
            <p className="text-[14px] text-white/70">We don’t send spam so don’t worry.</p>
            <form
              className="flex items-center gap-3 rounded-full border border-white/15 bg-white/5 p-2 pl-5"
              onSubmit={(event) => event.preventDefault()}
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                required
                placeholder="Email..."
                className="flex-1 bg-transparent text-[14px] text-white placeholder:text-white/50 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-[#4b35f5] px-5 py-2 text-[14px] font-semibold text-white transition hover:bg-[#3420d9]"
              >
                Submit
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-white/10 pt-8 text-[13px] text-white/60 md:flex-row md:items-center md:justify-between" data-aos="fade-up" data-aos-duration="700">
          <p>© {year} Educrat. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-5">
            <Link href="/terms" className="transition hover:text-[#44ffae]">
              Terms of Service
            </Link>
            <Link href="/privacy" className="transition hover:text-[#44ffae]">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="transition hover:text-[#44ffae]">
              Cookie Policy
            </Link>
            <div className="inline-flex items-center rounded-full border border-white/20 p-1 transition hover:border-[#44ffae]">
              <LanguageSwitcher placement="up" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
