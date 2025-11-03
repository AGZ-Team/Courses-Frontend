'use client';

import Image from 'next/image';
import Link from 'next/link';
import {HiOutlineArrowUpRight} from 'react-icons/hi2';
import {useTranslations} from 'next-intl';

const News = () => {
  const t = useTranslations('news');
  const blogPostsRaw = t.raw('blogPosts');
  const eventsRaw = t.raw('events');
  
  const blogPosts = Array.isArray(blogPostsRaw) 
    ? (blogPostsRaw as Array<{category: string; title: string; date: string}>).map((post, idx) => ({
        id: idx + 1,
        ...post,
        image: `/newsImg/${idx + 1}.png`
      }))
    : [];
    
  const events = Array.isArray(eventsRaw)
    ? (eventsRaw as Array<{category: string; title: string; date: string}>).map((event, idx) => ({
        id: idx + 1,
        ...event,
        image: `/newsImg/n${idx + 1}.png`
      }))
    : [];
  return (
    <section className="w-full bg-white py-24 sm:py-28">
      <div className="mx-auto w-full max-w-[1380px] px-4 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between" data-aos="fade-left" data-aos-duration="600">
          <div className="space-y-4">
            <h2 className="text-[32px] font-semibold text-[#131022] sm:text-[36px]">{t('title')}</h2>
            <p className="text-[15px] text-[#4f4a63]">{t('subtitle')}</p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-3 rounded-full border border-[#d5d6e6] bg-white px-6 py-3 text-[15px] font-medium text-[#4b35f5] shadow-[0_12px_24px_rgba(45,27,153,0.08)] transition hover:border-[#4b35f5] hover:bg-[#4b35f5] hover:text-white"
            data-aos="fade-left"
            data-aos-duration="700"
          >
            {t('browseBlog')}
            <HiOutlineArrowUpRight className="h-5 w-5" aria-hidden />
          </Link>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-2" data-aos="fade-up" data-aos-duration="700">
            {blogPosts.map((post, index) => (
              <article
                key={post.id}
                className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-[#e2ddff] bg-white shadow-[0_18px_40px_rgba(19,16,34,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(19,16,34,0.12)]"
                data-aos="fade-left"
                data-aos-duration={(index + 1) * 400}
              >
                <div className="relative h-[220px] w-full overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={600}
                    height={220}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
                    loading="lazy"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>

                <div className="flex flex-1 flex-col space-y-4 px-8 pb-9 pt-8">
                  <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#4b35f5]">{post.category}</span>
                  <h3 className="text-[20px] font-semibold text-[#131022]">
                    <Link href={`/blog/${post.id}`} className="transition hover:text-[#4b35f5]">
                      {post.title}
                    </Link>
                  </h3>
                  <span className="text-[14px] text-[#6b6a82]">{post.date}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="space-y-6" data-aos="fade-left" data-aos-duration="800">
            {events.map((event, index) => (
              <article
                key={event.id}
                className="group flex gap-5 rounded-[18px] border border-[#e2ddff] bg-white p-5 shadow-[0_18px_40px_rgba(19,16,34,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#4b35f5]/60 hover:shadow-[0_24px_60px_rgba(19,16,34,0.12)]"
                data-aos="fade-left"
                data-aos-delay={index * 120}
              >
                <div className="relative h-24 w-[110px] overflow-hidden rounded-[14px]">
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={110}
                    height={96}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
                    loading="lazy"
                    sizes="110px"
                  />
                </div>

                <div className="flex flex-col justify-center gap-2">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#4b35f5]">{event.category}</span>
                  <h3 className="text-[16px] font-semibold text-[#131022]">
                    <Link href={`/events/${event.id}`} className="transition hover:text-[#4b35f5]">
                      {event.title}
                    </Link>
                  </h3>
                  <span className="text-[14px] text-[#6b6a82]">{event.date}</span>
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
