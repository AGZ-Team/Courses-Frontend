import type {Metadata} from 'next';

const TERMS_SECTIONS = [
  {
    title: 'Using our services',
    paragraphs: [
      "You agree to access Educrat only through the interfaces we provide and in accordance with the instructions we publish. You may use our Services only as permitted by law, including applicable export and re-export control laws and regulations.",
      "We may suspend or stop providing our Services to you if you do not comply with our terms or policies, if you misuse the Services, or if we are investigating suspected misconduct. Using our Services does not give you ownership of any intellectual property rights in the Services or the content you access. You may not remove, obscure, or alter any legal notices displayed in or along with the Services."
    ]
  },
  {
    title: 'Your content in our services',
    paragraphs: [
      "When you submit, store, or send content to or through the Services, you give Educrat (and those we work with) a worldwide license to use, host, store, reproduce, modify, create derivative works, communicate, publish, publicly perform, publicly display, and distribute such content for the purpose of operating, promoting, and improving the Services, and to develop new ones.",
      "This license continues even if you stop using our Services. Make sure you have the necessary rights to grant us this license for any content that you submit to our Services."
    ]
  },
  {
    title: 'Subscriptions & payments',
    paragraphs: [
      "Some parts of Educrat are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis depending on the subscription plan you select. At the end of each period, your subscription will automatically renew under the exact same conditions unless you cancel it or Educrat cancels it.",
      "All fees are exclusive of taxes, levies, or duties imposed by taxing authorities, and you are responsible for payment of all such taxes, levies, or duties."
    ]
  },
  {
    title: 'Termination',
    paragraphs: [
      "We may suspend or terminate access to the Services immediately, without prior notice or liability, for any reason whatsoever, including if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.",
      "You may stop using the Services at any time. If you wish to terminate your account, you may simply discontinue using the Services or contact our support team for assistance."
    ]
  },
  {
    title: 'Changes to these terms',
    paragraphs: [
      "We reserve the right to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days’ notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.",
      "By continuing to access or use the Services after revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Services."
    ]
  },
  {
    title: 'Contact us',
    paragraphs: [
      "If you have any questions about these Terms, please reach out to our support team at support@educrat.com. We are committed to addressing your concerns and helping you get the most from Educrat."
    ]
  }
] as const;

export const metadata: Metadata = {
  title: 'Terms & Conditions | Educrat',
  description: 'Understand the terms and conditions that govern your use of the Educrat learning platform.'
};

export default function TermsPage() {
  return (
    <main className="w-full bg-white pb-24 pt-28 sm:pb-32 sm:pt-32">
      <div className="mx-auto max-w-[1080px] px-4 sm:px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6c63ff]">Terms &amp; Conditions</span>
          <h1 className="mt-6 text-[2.75rem] font-semibold text-[#120a5d] sm:text-[3rem]">Our commitment to clear guidelines</h1>
          <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-relaxed text-[#5f5c7b] sm:text-[18px]">
            We&apos;re on a mission to deliver engaging, curated courses at a reasonable price. These terms help
            protect the balance between the experience you expect and the trust you place in Educrat.
          </p>
        </div>

        <div className="mt-16 space-y-16">
          {TERMS_SECTIONS.map((section) => (
            <section key={section.title} className="space-y-5">
              <h2 className="text-[1.75rem] font-semibold text-[#140a5b]">{section.title}</h2>
              <div className="space-y-4 text-[16px] leading-7 text-[#4c4a63]">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-20 rounded-3xl border border-[#e5e7fb] bg-[#f8f7ff] p-8 sm:p-10">
          <h2 className="text-[1.5rem] font-semibold text-[#120a5d]">Need help understanding a clause?</h2>
          <p className="mt-3 text-[15px] leading-7 text-[#5f5c7b]">
            Our team is happy to walk you through how Educrat works. Reach out anytime and we&apos;ll respond within one
            business day: <a className="font-semibold text-[#4b35f5] underline-offset-4 hover:underline" href="mailto:support@educrat.com">support@educrat.com</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
