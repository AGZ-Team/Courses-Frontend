'use client';

import Image from 'next/image';
import Link from 'next/link';
import {LuCirclePlay, LuStar, LuUsers} from 'react-icons/lu';
import {FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter} from 'react-icons/fa';
import {HiOutlineArrowUpRight} from 'react-icons/hi2';

const SOCIAL_LINKS = [
  {label: 'Facebook', href: '#', Icon: FaFacebookF},
  {label: 'Twitter', href: '#', Icon: FaTwitter},
  {label: 'Instagram', href: '#', Icon: FaInstagram},
  {label: 'LinkedIn', href: '#', Icon: FaLinkedinIn}
] as const;

const INSTRUCTORS = [
  {
    id: 1,
    name: 'Floyd Miles',
    role: 'President of Sales',
    image: 'https://educrat-react.vercel.app/assets/img/team/1.png',
    rating: '4.5',
    students: '692 Students',
    courses: '15 Course'
  },
  {
    id: 2,
    name: 'Cameron Williamson',
    role: 'Web Designer',
    image: 'https://educrat-react.vercel.app/assets/img/team/2.png',
    rating: '3.8',
    students: '692 Students',
    courses: '15 Course'
  },
  {
    id: 3,
    name: 'Brooklyn Simmons',
    role: 'Dog Trainer',
    image: 'https://educrat-react.vercel.app/assets/img/team/3.png',
    rating: '5.0',
    students: '692 Students',
    courses: '15 Course'
  },
  {
    id: 4,
    name: 'Wade Warren',
    role: 'Marketing Coordinator',
    image: 'https://educrat-react.vercel.app/assets/img/team/4.png',
    rating: '4.2',
    students: '692 Students',
    courses: '15 Course'
  }
] as const;

const InstructorCarousel = () => {
  return (
    <section className="w-full bg-white py-24 sm:py-28">
      <div className="mx-auto w-full max-w-[1380px] px-4 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4" data-aos="fade-left" data-aos-duration="600">
            <h2 className="text-[32px] font-semibold text-[#131022] sm:text-[36px]">
              Learn from the best instructors
            </h2>
            <p className="text-[15px] text-[#4f4a63]">Lorem ipsum dolor sit amet, consectetur.</p>
          </div>

          <div data-aos="fade-left" data-aos-duration="600">
            <Link
              href="/instructors-list"
              className="inline-flex items-center gap-3 rounded-full border border-[#d5d6e6] bg-white px-6 py-3 text-[15px] font-medium text-[#4b35f5] shadow-[0_12px_24px_rgba(45,27,153,0.08)] transition hover:border-[#4b35f5] hover:bg-[#4b35f5] hover:text-white"
            >
              View All Instructors
              <HiOutlineArrowUpRight className="h-5 w-5" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {INSTRUCTORS.map((instructor, index) => (
            <article
              key={instructor.id}
              className="group flex flex-col"
              data-aos="fade-left"
              data-aos-duration="600"
              data-aos-delay={index * 120}
            >
              <div className="relative overflow-hidden rounded-[18px] bg-[#f3eefc]">
                <div className="relative aspect-[0.95] w-full">
                  <Image
                    src={instructor.image}
                    alt={instructor.name}
                    fill
                    sizes="(min-width: 1280px) 20vw, (min-width: 640px) 40vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    priority={index === 0}
                  />

                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#1a064fcc] opacity-0 transition duration-300 group-hover:opacity-100">
                    <div className="pointer-events-auto flex items-center gap-3 text-white">
                      {SOCIAL_LINKS.map(({label, href, Icon}) => (
                        <Link
                          key={label}
                          href={href}
                          aria-label={label}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white hover:text-[#4b35f5]"
                        >
                          <Icon className="h-4 w-4" aria-hidden />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-[18px] font-semibold text-[#131022]">{instructor.name}</h3>
                <p className="mt-1 text-[14px] text-[#6b6a82]">{instructor.role}</p>

                <div className="mt-5 flex flex-wrap items-center gap-4 text-[14px] text-[#292845]">
                  <span className="flex items-center gap-2 text-[#fbaf37]">
                    <LuStar className="h-4 w-4" aria-hidden />
                    {instructor.rating}
                  </span>
                  <span className="flex items-center gap-2 text-[#6b6a82]">
                    <LuUsers className="h-4 w-4" aria-hidden />
                    {instructor.students}
                  </span>
                  <span className="flex items-center gap-2 text-[#6b6a82]">
                    <LuCirclePlay className="h-4 w-4" aria-hidden />
                    {instructor.courses}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center text-[15px] text-[#4f4a63]" data-aos="fade-left" data-aos-duration="600">
          Want to help people learn, grow and achieve more in life?{' '}
          <Link href="/instructor-become" className="text-[#4b35f5] underline decoration-2 underline-offset-4">
            Become an instructor
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InstructorCarousel;
