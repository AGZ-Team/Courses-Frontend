'use client';

import Link from 'next/link';

const Ad = () => {
  return (
    <section className="w-full bg-[#4b35f5] py-16 sm:py-20">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-6 px-4 text-center sm:px-6 md:flex-row md:items-center md:justify-between md:text-left">
        <h2 className="text-[28px] font-semibold text-white sm:text-[32px]">
          Join more than <span className="text-[#44ffae]">8 million</span>
          <br className="hidden sm:block" /> learners worldwide
        </h2>

        <Link
          href="/courses"
          className="inline-flex items-center justify-center rounded-full bg-[#44ffae] px-8 py-3 text-[15px] font-semibold text-[#120847] shadow-[0_18px_40px_rgba(15,9,69,0.25)] transition hover:translate-y-[-2px] hover:bg-[#3de197]"
        >
          Start Learning For Free
        </Link>
      </div>
    </section>
  );
};

export default Ad;
