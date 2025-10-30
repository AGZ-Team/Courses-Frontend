'use client';

import Image from 'next/image';
import Link from 'next/link';
import {HiOutlineArrowUpRight} from 'react-icons/hi2';
import {useTranslations} from 'next-intl';

const BLOG_POST_IMAGES = [
  'https://educrat-react.vercel.app/assets/img/blog-list/1.png',
  'https://educrat-react.vercel.app/assets/img/blog-list/2.png'
] as const;

const EVENT_IMAGES = [
  'https://educrat-react.vercel.app/assets/img/courses-list/1.png',
  'https://educrat-react.vercel.app/assets/img/courses-list/2.png',
  'https://educrat-react.vercel.app/assets/img/courses-list/3.png'
] as const;

const News = () => {
  const t = useTranslations('news');
  const blogPostsRaw = t.raw('blogPosts');
  const blogPosts = Array.isArray(blogPostsRaw) ? (blogPostsRaw as Array<{category: string; title: string; date: string}>) : [];
  const eventsRaw = t.raw('events');
  const events = Array.isArray(eventsRaw) ? (eventsRaw as Array<{category: string; title: string; date: string}>) : [];

  return (
    <section className="w-full bg-white py-16 sm:py-20 md:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-[1380px] px-4 sm:px-6">
        <div className="flex flex-col gap-6 sm:gap-8 md:flex-row md:items-center md:justify-between" data-aos="fade-left" data-aos-duration="600">
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-[28px] sm:text-[32px] md:text-[36px] font-semibold text-[#131022]">{t('title')}</h2>
            <p className="text-[14px] sm:text-[15px] text-[#4f4a63]">{t('subtitle')}</p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 sm:gap-3 rounded-full border border-[#d5d6e6] bg-white px-5 sm:px-6 py-2.5 sm:py-3 text-[14px] sm:text-[15px] font-medium text-[#4b35f5] shadow-[0_12px_24px_rgba(45,27,153,0.08)] transition hover:border-[#4b35f5] hover:bg-[#4b35f5] hover:text-white"
            data-aos="fade-left"
            data-aos-duration="700"
          >
            {t('browseBlog')}
            <HiOutlineArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
          </Link>
        </div>

        <div className="mt-10 sm:mt-12 md:mt-14 grid gap-6 sm:gap-8 lg:grid-cols-3">
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:col-span-2" data-aos="fade-up" data-aos-duration="700">
            {blogPosts.map((post, index) => (
              <article
                key={index}
                className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-[#e2ddff] bg-white shadow-[0_18px_40px_rgba(19,16,34,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(19,16,34,0.12)]"
                data-aos="fade-left"
                data-aos-duration={(index + 1) * 400}
              >
                <div className="relative h-[180px] sm:h-[220px] w-full overflow-hidden">
                  <Image
                    src={BLOG_POST_IMAGES[index]}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.05]"
                  />
                </div>

                <div className="flex flex-1 flex-col space-y-3 sm:space-y-4 px-6 sm:px-8 pb-7 sm:pb-9 pt-6 sm:pt-8">
                  <span className="text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.12em] text-[#4b35f5]">{post.category}</span>
                  <h3 className="text-[18px] sm:text-[20px] font-semibold text-[#131022]">
                    <Link href={`/blog/${index + 1}`} className="transition hover:text-[#4b35f5]">
                      {post.title}
                    </Link>
                  </h3>
                  <span className="text-[13px] sm:text-[14px] text-[#6b6a82]">{post.date}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="space-y-5 sm:space-y-6" data-aos="fade-left" data-aos-duration="800">
            {events.map((event, index) => (
              <article
                key={index}
                className="group flex gap-4 sm:gap-5 rounded-[18px] border border-[#e2ddff] bg-white p-4 sm:p-5 shadow-[0_18px_40px_rgba(19,16,34,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#4b35f5]/60 hover:shadow-[0_24px_60px_rgba(19,16,34,0.12)]"
                data-aos="fade-left"
                data-aos-delay={index * 120}
              >
                <div className="relative h-20 w-24 sm:h-24 sm:w-[110px] overflow-hidden rounded-[14px] shrink-0">
                  <Image
                    src={EVENT_IMAGES[index]}
                    alt={event.title}
                    fill
                    sizes="110px"
                    className="object-cover transition duration-500 group-hover:scale-[1.05]"
                  />
                </div>

                <div className="flex flex-col justify-center gap-1.5 sm:gap-2 min-w-0">
                  <span className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.12em] text-[#4b35f5]">{event.category}</span>
                  <h3 className="text-[15px] sm:text-[16px] font-semibold text-[#131022]">
                    <Link href={`/events/${index + 1}`} className="transition hover:text-[#4b35f5]">
                      {event.title}
                    </Link>
                  </h3>
                  <span className="text-[13px] sm:text-[14px] text-[#6b6a82]">{event.date}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default News;
