import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { Cairo, Jost } from 'next/font/google'
import './globals.css'
import MainNavbar from '@/components/Navbar/MainNavbar'
import ConditionalFooter from '@/components/Footer/ConditionalFooter'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo', preload: false })
const jost = Jost({ subsets: ['latin'], variable: '--font-jost', preload: false })

export const metadata: Metadata = {
  title: '404 - Page Not Found | C R A Y',
  description: 'The page you are looking for does not exist. Return to the homepage to continue exploring.',
}

export default async function RootNotFound() {
  const messages = await getMessages()
  
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`min-h-screen bg-white ${jost.className}`}>
        <NextIntlClientProvider locale="en" messages={messages}>
          <header>
            <MainNavbar />
          </header>
          {/* Main Content */}
          <main className="min-h-[calc(100vh-400px)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 mt-24 bg-white">
          <div className="max-w-8xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
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
                <span className="text-[#0b0440]">4</span>
                <span className="text-[#0b0440]">0</span>
                <span className="text-primary">4</span>
              </h1>

              {/* Heading */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0b0440]">
                Oops! It looks like you&apos;re lost.
              </h2>

              {/* Description */}
              <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto lg:mx-0">
                The page you&apos;re looking for isn&apos;t available. Try to search again or use the go to.
              </p>

              {/* Language Selection and Home Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/en"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-primary rounded-lg hover:bg-transparent transition-colors border-2 border-primary duration-200 hover:text-primary"
                >
                  Go Home (English)
                </Link>
                <Link
                  href="/ar"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-primary bg-white border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-colors duration-200 font-serif"
                >
                  الصفحة الرئيسية (عربي)
                </Link>
              </div>
            </div>
          </div>
          </main>
          <ConditionalFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
