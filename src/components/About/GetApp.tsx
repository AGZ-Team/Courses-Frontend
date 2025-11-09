import Image from 'next/image';
import Link from 'next/link';
import {useTranslations, useLocale} from 'next-intl';

export default function GetApp() {
  const t = useTranslations('about.getApp');
  const locale = useLocale();

  return (
    <section className="w-full bg-[#f4f7fb] py-20 sm:py-24">
      <div className="mx-auto w-full max-w-[1380px] px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Left: devices image */}
          <div className="lg:col-span-7" data-aos="fade-up" data-aos-duration="400">
            <div className="relative mx-auto w-full max-w-3xl">
              <Image
                src="/aboutImages/GetApp/Devices.png"
                alt={t('imageAlt')}
                width={1200}
                height={700}
                className="h-auto w-full"
                priority
              />
            </div>
          </div>

          {/* Right: content */}
          <div className="lg:col-span-5">
            <div className="max-w-xl">
              <h2 className="text-[38px] font-semibold leading-tight text-[#120f2d] sm:text-[44px]">
                {t('title')}
                <br />
                <span className="text-primary">{t('highlight')}</span>
              </h2>
              <p className="mt-5 text-[15px] leading-7 text-[#4f4a63]">
                {t('description')}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href={t('apple.href')} aria-label={t('apple.aria')} className="inline-block">
                  <Image
                    src="/aboutImages/GetApp/1.svg"
                    alt={t('apple.alt')}
                    width={210}
                    height={64}
                    className="h-16 w-auto"
                    style={{ width: 'auto', height: 'auto' }}
                  />
                </Link>
                <Link href={t('google.href')} aria-label={t('google.aria')} className="inline-block">
                  <Image
                    src="/aboutImages/GetApp/2.svg"
                    alt={t('google.alt')}
                    width={210}
                    height={64}
                    className="h-16 w-auto"
                    style={{ width: 'auto', height: 'auto' }}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
