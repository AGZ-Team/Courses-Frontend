import type {Metadata} from 'next';

const HIGHLIGHTS = [
  {
    title: 'Crystal-clear transparency',
    description: 'We explain which data we collect, why we collect it, and how long we retain it in language that is easy to understand.'
  },
  {
    title: 'Security-first mindset',
    description: 'Your personal information is encrypted in transit and at rest, safeguarded by continuous monitoring and dedicated security reviews.'
  },
  {
    title: 'You control your data',
    description: 'Download, update, or delete your information whenever you need. We provide self-serve tools and responsive support to help.'
  }
] as const;

const POLICY_SECTIONS = [
  {
    title: 'Information we collect',
    paragraphs: [
      'We collect the information you share with us when creating an account, enrolling in a course, or interacting with Educrat content. This may include your name, email address, payment details, demographic information, and any preferences you choose to store in your profile.',
      'We also gather limited technical data such as browser type, device identifiers, and usage analytics to help us maintain platform reliability and improve the learning experience. We never collect more than we need, and we never sell your personal data.'
    ]
  },
  {
    title: 'How we use your information',
    paragraphs: [
      'Your information powers key Educrat features like course recommendations, progress tracking, certification, and customer support. We use aggregated insights to improve course quality, detect fraud, and keep the platform safe for learners and instructors alike.',
      'When we communicate with you, it is to deliver service updates, account notifications, or personalized learning tips. You can adjust your communication preferences or unsubscribe from marketing email at any time.'
    ]
  },
  {
    title: 'Sharing & third parties',
    paragraphs: [
      'We share information with trusted service providers who help us operate the platform—such as payment processors, analytics partners, and cloud hosting vendors. These partners are bound by strict confidentiality agreements and cannot use your data for their own purposes.',
      'If the law requires it, we may disclose limited information in response to valid legal requests. Otherwise, we never disclose personal data unless you provide explicit consent.'
    ]
  },
  {
    title: 'Data retention & deletion',
    paragraphs: [
      'We retain your personal information for as long as your account is active or as needed to provide Services. When data is no longer required, we erase or anonymize it. You may request deletion at any time by contacting support—once confirmed, we remove or de-identify your personal data within 30 days.',
      'Some information may persist in encrypted backups for a limited period before being completely removed.'
    ]
  },
  {
    title: 'International transfers',
    paragraphs: [
      'Educrat may process data on servers located in different countries. Whenever information crosses borders, we apply the same rigorous safeguards and rely on industry-standard legal mechanisms such as Standard Contractual Clauses to protect your privacy.'
    ]
  },
  {
    title: 'Your rights & choices',
    paragraphs: [
      'You can access, correct, download, or delete your personal information directly from your account dashboard. You also have the right to object to processing, withdraw consent, and file a complaint with your local data protection authority.',
      'To exercise any of these rights or ask a question, contact us at privacy@educrat.com. We respond within one business day.'
    ]
  }
] as const;

export const metadata: Metadata = {
  title: 'Privacy Policy | Educrat',
  description: 'Discover how Educrat protects learner privacy, keeps your data safe, and gives you control over your information.'
};

export default function PrivacyPage() {
  return (
    <main className="w-full bg-white pb-28 pt-28 sm:pb-36 sm:pt-32">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[40px] bg-[#120a5d] px-6 py-16 text-white shadow-[0_28px_60px_rgba(18,10,93,0.28)] sm:px-10">
          <div className="absolute -top-32 right-10 h-72 w-72 rounded-full bg-[#44ffae]/20 blur-3xl" aria-hidden />
          <div className="absolute -bottom-20 left-0 h-64 w-64 rounded-full bg-[#6c63ff]/30 blur-3xl" aria-hidden />
          <div className="relative z-10 space-y-6">
            <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-1 text-sm font-semibold tracking-[0.22em] text-white/80">
              Privacy Policy
            </span>
            <h1 className="text-[2.8rem] font-semibold leading-tight sm:text-[3.1rem]">
              Protecting your learning journey
            </h1>
            <p className="max-w-3xl text-[18px] leading-8 text-white/85">
              We design every Educrat experience with privacy in mind—from the courses you browse to the certifications you earn.
              This policy explains how we collect, use, and safeguard your information, and the controls you have along the way.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {HIGHLIGHTS.map((highlight) => (
            <div key={highlight.title} className="group h-full rounded-2xl border border-[#e5e7fb] bg-white p-6 shadow-[0_16px_40px_rgba(18,10,93,0.05)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(18,10,93,0.12)]">
              <h2 className="text-[20px] font-semibold text-[#120a5d]">{highlight.title}</h2>
              <p className="mt-3 text-[15px] leading-7 text-[#5f5c7b]">{highlight.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 space-y-16">
          {POLICY_SECTIONS.map((section) => (
            <section key={section.title} className="space-y-5">
              <h2 className="text-[1.9rem] font-semibold text-[#140a5b]">{section.title}</h2>
              <div className="space-y-4 text-[16px] leading-7 text-[#4c4a63]">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-24 grid gap-8 rounded-[32px] border border-[#e5e7fb] bg-[#f8f7ff] p-8 sm:grid-cols-[1.1fr_0.9fr] sm:p-10">
          <div className="space-y-4">
            <h2 className="text-[1.6rem] font-semibold text-[#120a5d]">Need a data export or deletion?</h2>
            <p className="text-[15px] leading-7 text-[#5f5c7b]">
              Use the account dashboard to download your learning history and certificates. Prefer a guided request? Our privacy
              team will help you gather, update, or remove your data within 24 hours.
            </p>
            <a
              href="mailto:privacy@educrat.com"
              className="inline-flex items-center justify-center rounded-full bg-[#4b35f5] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_18px_40px_rgba(75,53,245,0.35)] transition hover:bg-[#3420d9]"
            >
              Email privacy@educrat.com
            </a>
          </div>
          <div className="space-y-3 rounded-2xl border border-white/40 bg-white/60 p-6 text-[14px] text-[#4c4a63] shadow-[0_18px_40px_rgba(18,10,93,0.08)]">
            <h3 className="text-[16px] font-semibold text-[#120a5d]">Quick access</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-[#44ffae]" aria-hidden />
                Download your account data from the dashboard settings.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-[#4b35f5]" aria-hidden />
                Update email preferences directly from any Educrat email footer.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-[#ff9f43]" aria-hidden />
                Reach out to support for enterprise privacy agreements or data processing addendums.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
