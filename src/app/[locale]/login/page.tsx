import React from 'react'
import {setRequestLocale} from 'next-intl/server';

type PageProps = {
  params: Promise<{locale: string}>;
};

export default async function LoginPage({params}: PageProps) {
  const {locale} = await params;
  setRequestLocale(locale);
  
  return (
    <div>login</div>
  )
}
