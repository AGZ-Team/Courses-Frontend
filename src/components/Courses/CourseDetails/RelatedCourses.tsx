'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import { useLocale } from 'next-intl';
import type { CourseCard } from '../CourseCard';

interface RelatedCoursesProps {
  courses: CourseCard[];
}

export function RelatedCourses({ courses }: RelatedCoursesProps) {
  const locale = useLocale();
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">Related Courses</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/${locale}/courses/${course.id}`}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
            >
              <img src={course.image} alt={course.title} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform" />
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600">{course.title}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium">{course.rating}</span>
                  <span className="text-sm text-gray-500">({course.ratingCount})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-purple-600">${course.price.current}</span>
                  {course.price.previous && (
                    <span className="text-gray-400 line-through">${course.price.previous}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
