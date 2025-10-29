import React from 'react';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import ContactContent from '@/components/Contact/ContactContent';
import type {Metadata} from 'next';

type PageProps = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({namespace: 'metadata.contact', locale});

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function ContactPage({params}: PageProps) {
  const {locale} = await params;
  setRequestLocale(locale);

  return <ContactContent />;
}
