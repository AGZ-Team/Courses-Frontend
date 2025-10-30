import Image from 'next/image';
import Link from 'next/link';
import {FiCheck} from 'react-icons/fi';
import {useTranslations} from 'next-intl';

const JoinUs = () => {
  const t = useTranslations('joinUs');
  const highlightsRaw = t.raw('highlights');
  const highlights = Array.isArray(highlightsRaw) ? (highlightsRaw as string[]) : [];

  return (
    <section className="w-full bg-[#fbf8ff] py-16 sm:py-20 md:py-24 lg:py-28">
      <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-10 sm:gap-12 md:gap-16 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl text-left" data-aos="fade-up">
          <h2 className="text-[32px] sm:text-[38px] md:text-[44px] font-semibold leading-[1.18] text-[#120f2d]">
            <span className="text-[#6440fb]">{t('titlePart1')}</span> {t('titlePart2')}
          </h2>
          <p className="mt-4 sm:mt-5 text-[14px] sm:text-[15px] leading-[24px] sm:leading-[26px] text-[#4d4a63]" data-aos="fade-up" data-aos-delay="50">
            {t('description')}
          </p>

          <ul className="mt-6 sm:mt-8 space-y-3 sm:space-y-4" data-aos="fade-up" data-aos-delay="100">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-3 sm:gap-4 text-[14px] sm:text-[15px] text-[#171435]">
                <span className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#6440fb] text-white shadow-[0_12px_28px_rgba(57,26,170,0.22)] flex-shrink-0">
                  <FiCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                </span>
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/auth/signup"
            className="mt-8 sm:mt-10 inline-flex h-[50px] sm:h-[58px] items-center justify-center rounded-lg bg-[#120f2d] px-10 sm:px-16 text-[14px] sm:text-[15px] font-medium text-white transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#120f2d] hover:bg-transparent hover:border hover:border-[#120f2d] hover:text-[#120f2d]"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            {t('cta')}
          </Link>
        </div>

        <div className="flex w-full max-w-[680px] justify-center lg:max-w-[620px]" data-aos="fade-up" data-aos-delay="200">
          <div className="relative flex w-full justify-center p-4 sm:p-6">
            <div
              className="relative h-full w-full overflow-hidden"
              style={{
                clipPath:
                  'polygon(0 0, calc(100% - 40px) 0, 100% 40px, 100% 100%, 0 100%)',
                borderRadius: '20px'
              }}
            >
              <Image
                src="https://educrat-react.vercel.app/assets/img/about/1.png"
                alt={t('imageAlt')}
                width={520}
                height={520}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <span className="absolute right-4 sm:right-6 top-4 sm:top-6 h-10 w-10 sm:h-14 sm:w-14 rounded-full border-4 border-white/60 bg-[#fbf8ff]" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinUs;
