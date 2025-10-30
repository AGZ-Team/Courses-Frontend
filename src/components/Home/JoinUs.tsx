import Image from 'next/image';
import Link from 'next/link';
import {FiCheck} from 'react-icons/fi';

const HIGHLIGHTS = [
  'Hand-picked authors',
  'Easy to follow curriculum',
  'Free courses',
  'Money-back guarantee'
] as const;

const JoinUs = () => {
  return (
    <section className="w-full bg-[#fbf8ff] py-24 sm:py-28">
      <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-16 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl text-left" data-aos="fade-up">
          <h2 className="text-[38px] font-semibold leading-[1.18] text-[#120f2d] sm:text-[44px]">
            <span className="text-[#6440fb]">Learn</span> new skills when and where you like.
          </h2>
          <p className="mt-5 text-[15px] leading-[26px] text-[#4d4a63]" data-aos="fade-up" data-aos-delay="50">
            Use the list below to bring attention to your product&apos;s key
            <br className="hidden sm:block" /> differentiator.
          </p>

          <ul className="mt-8 space-y-4" data-aos="fade-up" data-aos-delay="100">
            {HIGHLIGHTS.map((item, index) => (
              <li key={item} className="flex items-center gap-4 text-[15px] text-[#171435]">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6440fb] text-white shadow-[0_12px_28px_rgba(57,26,170,0.22)]">
                  <FiCheck className="h-4 w-4" aria-hidden />
                </span>
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/auth/signup"
            className="mt-10 inline-flex h-[58px] items-center justify-center rounded-lg bg-[#120f2d] px-16 text-[15px] font-medium text-white transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#120f2d] hover:bg-transparent hover:border hover:border-[#120f2d] hover:text-[#120f2d]"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            Join Free
          </Link>
        </div>

        <div className="flex w-full max-w-[680px] justify-center lg:max-w-[620px]" data-aos="fade-up" data-aos-delay="200">
          <div className="relative flex w-full justify-center  p-6">
            <div
              className="relative h-full w-full overflow-hidden"
              style={{
                clipPath:
                  'polygon(0 0, calc(100% - 56px) 0, 100% 56px, 100% 100%, 0 100%)',
                borderRadius: '28px'
              }}
            >
              <Image
                src="https://educrat-react.vercel.app/assets/img/about/1.png"
                alt="Student learning online"
                width={520}
                height={520}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <span className="absolute right-6 top-6 h-14 w-14 rounded-full border-4 border-white/60 bg-[#fbf8ff]" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinUs;
