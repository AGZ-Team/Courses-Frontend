'use client';

import {RiBookOpenLine, RiGraduationCapLine, RiBriefcaseLine} from 'react-icons/ri';

const REASONS = [
  {
    id: 1,
    title: '01. Learn',
    description: 'Lorem ipsum dolor sit amet, consectetur dolori id adipiscing elit. Felis donec massa aliquam.',
    Icon: RiBookOpenLine
  },
  {
    id: 2,
    title: '02. Graduate',
    description: 'Lorem ipsum dolor sit amet, consectetur dolori id adipiscing elit. Felis donec massa aliquam.',
    Icon: RiGraduationCapLine
  },
  {
    id: 3,
    title: '03. Work',
    description: 'Lorem ipsum dolor sit amet, consectetur dolori id adipiscing elit. Felis donec massa aliquam.',
    Icon: RiBriefcaseLine
  }
] as const;

const CoursesReasons = () => {
  return (
    <section className="w-full bg-[#18035a] py-24 sm:py-28">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-16 px-4 text-center sm:px-6">
        <div className="space-y-4" data-aos="fade-up" data-aos-duration="800">
          <h2 className="text-[32px] font-semibold text-white sm:text-[36px]">Why learn with our courses?</h2>
          <p className="text-[15px] text-white/70">
            Lorem ipsum dolor sit amet, consectetur.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-aos="fade-up" data-aos-duration="800">
          {REASONS.map((reason, index) => (
            <article
              key={reason.id}
              className="group flex flex-col rounded-[18px] border border-[#362084] bg-[#1f0d6f] px-9 py-14 text-center text-white transition duration-300 hover:border-[#4aff9a] hover:shadow-[0_24px_60px_rgba(16,11,74,0.35)] hover:text-black hover:bg-white"
              data-aos="fade-up"
              data-aos-delay={index * 150}
>
              <div className="flex h-20 w-20 items-center justify-center mx-auto rounded-2xl text-green-300 transition duration-300 group-hover:text-black">
                <reason.Icon className="h-12 w-12 transition duration-300 group-hover:text-black" aria-hidden />
              </div>
              <h3 className="mt-10 text-[20px] font-semibold ">{reason.title}</h3>
              <p className="mt-4 text-[15px] leading-[26px]">{reason.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesReasons;
