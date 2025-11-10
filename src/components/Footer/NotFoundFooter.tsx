'use client';

import Link from 'next/link';
import {FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter} from 'react-icons/fa';

const FOOTER_LINK_GROUPS = [
  {
    title: 'About',
    links: [
      {label: 'About Us', href: '/en/about'},
      {label: 'Learner Stories', href: '/en/blog'},
      {label: 'Careers', href: '/en/careers'},
      {label: 'Press', href: '/en/press'},
      {label: 'Leadership', href: '/en/leadership'},
      {label: 'Contact Us', href: '/en/contact'}
    ]
  },
  {
    title: 'Categories',
    links: [
      {label: 'Development', href: '/en/categories/development'},
      {label: 'Business', href: '/en/categories/business'},
      {label: 'Finance & Accounting', href: '/en/categories/finance'},
      {label: 'IT & Software', href: '/en/categories/it-software'},
      {label: 'Office Productivity', href: '/en/categories/office-productivity'},
      {label: 'Design', href: '/en/categories/design'},
      {label: 'Marketing', href: '/en/categories/marketing'}
    ]
  },
  {
    title: 'Others',
    links: [
      {label: 'Lifestyle', href: '/en/categories/lifestyle'},
      {label: 'Photography & Video', href: '/en/categories/photography-video'},
      {label: 'Health & Fitness', href: '/en/categories/health-fitness'},
      {label: 'Music', href: '/en/categories/music'},
      {label: 'UX Design', href: '/en/categories/ux-design'},
      {label: 'SEO', href: '/en/categories/seo'}
    ]
  },
  {
    title: 'Support',
    links: [
      {label: 'Documentation', href: '/en/support/documentation'},
      {label: 'FAQs', href: '/en/support/faqs'},
      {label: 'Dashboard', href: '/en/dashboard'},
      {label: 'Contact', href: '/en/contact'}
    ]
  }
] as const;

const SOCIAL_LINKS = [
  {label: 'Facebook', href: '#', Icon: FaFacebookF},
  {label: 'x', href: '#', Icon: FaTwitter},
  {label: 'Instagram', href: '#', Icon: FaInstagram},
  {label: 'LinkedIn', href: '#', Icon: FaLinkedinIn}
] as const;

const NotFoundFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#100b44] text-white">
      <div className="mx-auto w-full max-w-[1180px] px-4 pb-16 pt-10 sm:px-6">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-12 md:flex-row md:items-center md:justify-between">
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
            <span className="text-[28px] font-semibold">Educrat</span>
          </div>

          <div className="space-y-3 text-right md:text-left">
            <p className="text-[16px] text-[#00FF91]">Follow us on social media</p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({label, href, Icon}) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 transition hover:bg-[#00FF91] hover:text-black"
                >
                  <Icon className="h-[15px] w-[15px]" aria-hidden />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {FOOTER_LINK_GROUPS.map((group) => (
            <div key={group.title} className="space-y-5">
              <h3 className="text-[17px] font-bold uppercase tracking-[0.15em] text-[#00FF91]">
                {group.title}
              </h3>
              <ul className="space-y-3 text-[14px] text-white font-semibold">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition hover:text-[#00FF91] hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-5 lg:col-span-1">
            <h3 className="text-[14px] font-semibold uppercase tracking-[0.15em] text-white">Get in touch</h3>
            <p className="text-[13px] text-white/70">We don&apos;t send spam so don&apos;t worry.</p>
            <form
              className="flex flex-col gap-3"
              onSubmit={(event) => event.preventDefault()}
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                required
                placeholder="Your email"
                className="w-full rounded-lg border border-white/15 bg-white/5 py-3 px-4 text-[13px] text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none transition"
              />
              <button
                type="submit"
                className="ms-auto inline-flex items-center justify-center rounded-lg bg-[#6d61ff] px-6 py-3 text-[13px] font-semibold text-white transition hover:bg-[#00FF91] hover:text-black"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col font-semibold gap-6 border-t border-white/10 pt-8 text-[14px] text-white md:flex-row md:items-center md:justify-between">
          <p>© {year} Educrat. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-5">
            <Link href="/en/terms" className="transition hover:text-[#00FF91]">
              Terms of Service
            </Link>
            <Link href="/en/privacy" className="transition hover:text-[#00FF91]">
              Privacy Policy
            </Link>
            <Link href="/en/cookies" className="transition hover:text-[#00FF91]">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default NotFoundFooter;
