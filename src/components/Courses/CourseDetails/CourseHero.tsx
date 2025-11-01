'use client';

import { Star, Users, Clock, Play } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { CourseCard } from '../CourseCard';

interface CourseHeroProps {
  course: CourseCard;
}

export function CourseHero({ course }: CourseHeroProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const duration = Math.floor(course.durationMinutes / 60);
  const t = useTranslations('courseDetails');

  const getBadgeStyles = (variant: string) => {
    switch (variant) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'accent':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-blue-900 text-white';
    }
  };

  return (
    <>
      <section className="relative bg-white text-[#1f1c3b]">
        <div className="container mx-auto px-4 py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start" id="course-hero">
            {/* Left Column (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Badges */}
              {course.badges && course.badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {course.badges.map((badge, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${getBadgeStyles(badge.variant)}`}
                    >
                      {badge.label}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-[28px] lg:text-[32px] xl:text-[36px] font-bold leading-tight text-[#120a5d]">
                {course.title}
              </h1>

              {/* Description */}
              {course.summary && (
                <p className="text-[#5f5c7b] leading-relaxed">
                  {course.summary}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap gap-6">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <span className="text-[#f6c160] font-semibold">
                    {course.rating}
                  </span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(course.rating)
                            ? 'fill-[#f6c160] text-[#f6c160]'
                            : 'text-[#c1bfd7]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[#8e8aa9]">({course.ratingCount})</span>
                </div>

                {/* Enrolled */}
                <div className="flex items-center gap-2 text-[#6e6b8f]">
                  <Users className="w-4 h-4" />
                  <span>
                    853 {t('enrolledCount')}
                  </span>
                </div>

                {/* Last Updated */}
                <div className="flex items-center gap-2 text-[#6e6b8f]">
                  <Clock className="w-4 h-4" />
                  <span>
                    {t('lastUpdated')} 11/2021
                  </span>
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={course.authorAvatar}
                  alt={course.author}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-[#6e6b8f]">{course.author}</span>
              </div>

              {/* Social Share */}
              <div className="flex gap-3 pt-2">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                  <button
                    key={social}
                    className="w-10 h-10 rounded-full border border-[#e6e4f5] hover:bg-blue-50 transition-colors flex items-center justify-center text-[#6e6b8f] hover:text-blue-900"
                    aria-label={`Share on ${social}`}
                  >
                    <span className="text-sm">f</span>
                  </button>
                ))}
              </div>

              <div className="mt-10 space-y-10">
                <div>
                  <h2 className="text-xl font-bold text-[#120a5d]">{t('overview.description')}</h2>
                  <div className="mt-4 text-[#5f5c7b] leading-relaxed space-y-4">
                    <p>{t('overview.p1')}</p>
                    <p>{t('overview.p2')}</p>
                    <p>{t('overview.p3')}</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#120a5d]">{t('overview.whatYouLearn')}</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {course.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="mt-1 inline-block h-4 w-4 rounded-full border-2 border-[#d9d7f0]" />
                        <span className="text-[#433f74]">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#120a5d]">{t('overview.requirements')}</h2>
                  <ul className="mt-4 space-y-3 text-[#433f74]">
                    <li className="flex items-start gap-3"><span className="mt-1 text-[#6440fb]">•</span><span>{t('overview.req1')}</span></li>
                    <li className="flex items-start gap-3"><span className="mt-1 text-[#6440fb]">•</span><span>{t('overview.req2')}</span></li>
                    <li className="flex items-start gap-3"><span className="mt-1 text-[#6440fb]">•</span><span>{t('overview.req3')}</span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column - Image & Price (Sticky) */}
            <div className="lg:col-span-1 space-y-6 sticky top-24">
              {/* Course Image with Play Button */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <button
                    onClick={() => setIsVideoOpen(true)}
                    className="w-16 h-16 rounded-full bg-white hover:bg-gray-100 transition-all transform hover:scale-110 flex items-center justify-center shadow-xl"
                    aria-label="Play video"
                  >
                    <Play className="w-6 h-6 text-blue-600 ml-1 fill-blue-600" />
                  </button>
                </div>
              </div>

              {/* Price Card */}
              <div className="rounded-2xl border border-[#eceaf8] bg-white p-6 shadow-[0_20px_50px_rgba(12,10,78,0.08)]">
                <div className="flex items-end justify-between mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-[#120a5d]">${course.price.current}</span>
                    {course.price.previous && (
                      <span className="text-base text-[#8e8aa9] line-through">${course.price.previous}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button className="px-6 py-3 bg-[#6440fb] hover:bg-blue-900 text-white font-semibold rounded-md transition-colors">
                    {t('addToCart')}
                  </button>
                  <button className="px-6 py-3 border-2 border-[#1f1c3b] text-[#1f1c3b] hover:bg-[#1f1c3b] hover:text-white font-semibold rounded-md transition-colors">
                    {t('buyNow')}
                  </button>
                </div>

                <p className="text-center text-xs text-[#6e6b8f] mt-4">{t('moneyBackGuarantee')}</p>

                <div className="mt-6 space-y-3">
                  <DetailRow label={t('lessons')} value={course.lessons.toString()} />
                  <DetailRow label={t('quizzes')} value="3" />
                  <DetailRow label={t('duration')} value={`${duration} ${t('hours')}`} />
                  <DetailRow label={t('skillLevel')} value={course.level} />
                  <DetailRow label={t('language')} value={t('english')} />
                  <DetailRow label={t('certificate')} value={t('yes')} />
                  <DetailRow label={t('lifetimeAccess')} value={t('yes')} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setIsVideoOpen(false)}>
          <div className="relative w-full max-w-4xl mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              Close
            </button>
            <div className="relative pt-[56.25%]">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/LlCwHnp3kL4?autoplay=1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#f0effa] last:border-b-0">
      <span className="text-[#6e6b8f]">{label}</span>
      <span className="text-[#120a5d] font-medium">{value}</span>
    </div>
  );
}
