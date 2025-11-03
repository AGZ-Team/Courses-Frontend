import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'metadata.notFound' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default function NotFound() {
  const t = useTranslations('notFound')
  const locale = useLocale()

  return (
    <div className="min-h-[calc(100vh-400px)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 mt-24 bg-white">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left side - Illustration */}
        <div className="flex justify-center lg:justify-end order-2 lg:order-1">
          <div className="relative w-full max-w-2xl lg:max-w-3xl">
            <Image
              src="/404/1.svg"
              alt="404 illustration"
              width={800}
              height={800}
              priority
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Right side - Content */}
        <div className="text-center lg:text-left order-1 lg:order-2 space-y-6">
          {/* 404 Number */}
          <h1 className="text-8xl sm:text-9xl font-extrabold leading-none">
            <span className="text-[#0b0440]">{t('title').slice(0, 1)}</span>
            <span className="text-[#0b0440]">{t('title').slice(1, 2)}</span>
            <span className="text-[#6440fb]">{t('title').slice(2)}</span>
          </h1>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0b0440]">
            {t('heading')}
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto lg:mx-0">
            {t('description')}
          </p>

          {/* Back to Home Button */}
          <div className="pt-4">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-[#6440fb] rounded-lg hover:bg-[#5835d4] transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              {t('backToHome')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
