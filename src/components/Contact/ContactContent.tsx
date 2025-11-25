'use client';

import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { MdLocationOn, MdPhone, MdEmail } from 'react-icons/md';
import { FiPlus, FiMinus } from 'react-icons/fi';

export default function ContactContent() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const emailContactsRaw = t.raw('emailContacts.items');
  const emailContacts = Array.isArray(emailContactsRaw)
    ? (emailContactsRaw as {label: string; email: string}[])
    : [];

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <div className="bg-[#fafafb]">
      {/* Map Section - Full Width */}
      <section className="h-[400px] w-full md:h-[500px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28814.496366694224!2d32.2897243364746!3d31.252838273295435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f99c527c07cc1f%3A0xb429a612eba7a577!2sPort%20Said%20Ferry!5e1!3m2!1sen!2seg!4v1761746608582!5m2!1sen!2seg"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>

      {/* Contact Info & Form Section */}
      <section className="relative mx-auto max-w-[1200px] px-4 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left Side - Contact Info */}
          <div>
            <h2 className="mb-4 text-3xl font-bold text-[#1a0b40] lg:text-4xl">
              {t('title')}
            </h2>
            <p className="mb-10 text-base leading-relaxed text-gray-600">
              {t('subtitle')}
            </p>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <MdLocationOn className="text-2xl text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-[18px] leading-relaxed text-gray-700">
                    {t('address')}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <MdPhone className="text-2xl text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-[18px] leading-relaxed text-gray-700">
                    {t('phone')}
                  </p>
                </div>
              </div>

          

              {emailContacts.length > 0 && (
                <div className="mt-8 rounded-2xl pl-4" dir={isAr ? 'rtl' : 'ltr'}>
                  <h3 className="text-lg font-semibold text-[#1a0b40]">
                  <MdEmail className="inline-block mr-4 text-2xl text-primary" />
                    {t('emailContacts.title')} 
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {emailContacts.map(({label, email}) => (
                      <li
                        key={email}
                        className="flex flex-col gap-2 rounded-xl bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                      >
                        <span className="text-sm font-medium text-[#1a0b40]">{label}</span>
                        <a
                          href={`mailto:${email}`}
                          className="text-sm font-semibold text-[#0ABAB5] transition hover:text-[#088984] hover:underline"
                        >
                          {email}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="rounded-2xl w-full">
            <h2 className="mb-4 text-3xl font-bold text-[#1a0b40] lg:text-4xl">
              {t('formTitle')}
            </h2>
            <p className="mb-8 text-base leading-relaxed text-gray-600">
              {t('formSubtitle')}
            </p>

            <form className="space-y-5">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder={t('nameLabel')}
                  className="block w-full rounded-lg border border-gray-200 bg-white px-5 py-4 text-[15px] text-gray-900 placeholder-gray-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  dir={isAr ? 'rtl' : 'ltr'}
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder={t('emailLabel')}
                  className="block w-full rounded-lg border border-gray-200 bg-white px-5 py-4 text-[15px] text-gray-900 placeholder-gray-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  dir={isAr ? 'rtl' : 'ltr'}
                />
              </div>

              <div>
                <textarea
                  name="message"
                  rows={6}
                  placeholder={t('messageLabel')}
                  className="block w-full rounded-lg border border-gray-200 bg-white px-5 py-4 text-[15px] text-gray-900 placeholder-gray-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  dir={isAr ? 'rtl' : 'ltr'}
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center border rounded-lg bg-primary px-8 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-transparent hover:text-primary hover:border-primary hover:cursor-pointer"
              >
                {t('submit')}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[900px] px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-[#1a0b40] lg:text-4xl">
              {t('faqTitle')}
            </h2>
            <p className="text-base text-gray-600">{t('faqSubtitle')}</p>
          </div>

          <div className="space-y-4">
            {t.raw('faqs').map((faq: { question: string; answer: string }, index: number) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-all"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  dir={isAr ? 'rtl' : 'ltr'}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-gray-50"
                >
                  <span
                    className={`flex-1 text-[15px] font-semibold text-[#1a0b40] ${
                      isAr ? 'order-2 text-right' : 'order-1 text-left'
                    }`}
                  >
                    {faq.question}
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform ${
                      isAr ? 'order-1' : 'order-2'
                    }`}
                  >
                    {activeAccordion === index ? (
                      <FiMinus className="text-sm" />
                    ) : (
                      <FiPlus className="text-sm" />
                    )}
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    activeAccordion === index
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-gray-100 px-6 py-5 text-[15px] leading-relaxed text-gray-600">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
