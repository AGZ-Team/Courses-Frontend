import { notFound } from 'next/navigation';
import { CourseHero } from '@/components/Courses/CourseDetails/CourseHero';
import { CourseContent } from '@/components/Courses/CourseDetails/CourseContent';
import { RelatedCourses } from '@/components/Courses/CourseDetails/RelatedCourses';
import type { CourseCard } from '@/components/Courses/CourseCard';

// Course data - ideally this would come from an API or database
const COURSES: CourseCard[] = [
  {
    id: 1,
    title: 'Learn Figma  UI/UX Design Essential Training',
    image: '/coursesImages/1.png',
    rating: 4.3,
    ratingCount: 1991,
    lessons: 6,
    durationMinutes: 320,
    level: 'Beginner',
    author: 'Jane Cooper',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: { previous: 199, current: 79 },
    badges: [{ label: 'Popular', variant: 'accent' }],
    summary:
      'Master the fundamentals of UI/UX design in Figma with hands-on projects, critiques, and responsive workflows.',
    highlights: [
      'Design accessible component systems',
      'Craft polished prototypes quickly',
      'Receive expert feedback sessions'
    ],
    ctaLabel: 'Add to Cart'
  },
  {
    id: 2,
    title: 'Complete Python Bootcamp From Zero to Hero in Python',
    image: '/coursesImages/2.png',
    rating: 4.7,
    ratingCount: 2891,
    lessons: 8,
    durationMinutes: 410,
    level: 'Expert',
    author: 'Jenny Wilson',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: { previous: 189, current: 89 },
    badges: [
      { label: 'Popular', variant: 'accent' },
      { label: 'Best Sellers', variant: 'success' }
    ],
    summary:
      'Build production-ready Python applications using modern tooling, testing, and deployment practices.',
    highlights: [
      'Write clean, maintainable Python code',
      'Practice with 20+ guided projects',
      'Ace technical interviews with confidence'
    ],
    ctaLabel: 'Add to Cart'
  },
  {
    id: 3,
    title: 'Angular  The Complete Guide (2022 Edition)',
    image: '/coursesImages/3.png',
    rating: 4.5,
    ratingCount: 1983,
    lessons: 6,
    durationMinutes: 420,
    level: 'Intermediate',
    author: 'Albert Flores',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: { previous: 249, current: 129 },
    summary:
      'Ship enterprise Angular apps with robust architecture, state management, testing, and CI/CD integrations.',
    highlights: [
      'Master RxJS & NgRx patterns',
      'Optimize performance with lazy loading',
      'Automate deployments with pipelines'
    ],
    ctaLabel: 'Add to Cart'
  },
  {
    id: 4,
    title: 'The Ultimate Drawing Course Beginner to Advanced',
    image: '/coursesImages/4.png',
    rating: 4.2,
    ratingCount: 1981,
    lessons: 7,
    durationMinutes: 430,
    level: 'Expert',
    author: 'Jacob Jones',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: { previous: 179, current: 99 },
    badges: [{ label: 'Best Sellers', variant: 'success' }],
    summary:
      'Develop professional drawing skills with structured exercises, feedback, and portfolio-ready projects.',
    highlights: [
      'Understand light, form, and perspective',
      'Create captivating compositions',
      'Refine your personal illustration style'
    ],
    ctaLabel: 'Enroll Now'
  },
  {
    id: 5,
    title: 'Creative Interface Systems: From Components to Craft',
    image: '/coursesImages/5.png',
    rating: 4.6,
    ratingCount: 1730,
    lessons: 5,
    durationMinutes: 360,
    level: 'Advanced',
    author: 'Courtney Henry',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: { previous: 219, current: 109 },
    summary:
      'Design and document scalable component libraries that bridge design and engineering teams.',
    highlights: [
      'Craft accessible component APIs',
      'Automate design tokens & theming',
      'Collaborate seamlessly with developers'
    ],
    ctaLabel: 'Add to Cart'
  },
  {
    id: 6,
    title: 'Modern Web Development: Build Responsive Experiences',
    image: '/coursesImages/7.png',
    rating: 4.8,
    ratingCount: 2310,
    lessons: 9,
    durationMinutes: 480,
    level: 'Advanced',
    author: 'Guy Hawkins',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: { previous: 229, current: 139 },
    summary:
      'Ship modern full-stack web apps with resilient architecture, CI/CD, and best-in-class performance.',
    highlights: [
      'Architect scalable frontends',
      'Integrate robust CI/CD pipelines',
      'Deliver 90+ Lighthouse scores'
    ],
    ctaLabel: 'Add to Cart'
  },
  {
    id: 7,
    title: 'Photography Masterclass: Complete Guide to Photography',
    image: '/coursesImages/8.png',
    rating: 4.4,
    ratingCount: 1570,
    lessons: 8,
    durationMinutes: 515,
    level: 'Intermediate',
    author: 'Theresa Webb',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: { previous: 219, current: 129 },
    summary:
      'Capture studio-quality photos anywhere with pro lighting, composition, and editing techniques.',
    highlights: [
      'Master manual camera settings',
      'Design cinematic lighting setups',
      'Edit confidently in Lightroom'
    ],
    ctaLabel: 'Add to Cart'
  },
  {
    id: 8,
    title: 'Animation Fundamentals: Bring Characters to Life',
    image: '/coursesImages/6.png',
    rating: 4.4,
    ratingCount: 1250,
    lessons: 5,
    durationMinutes: 360,
    level: 'Intermediate',
    author: 'Courtney Henry',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: { previous: 199, current: 119 },
    summary:
      'Animate expressive characters with professional principles, workflows, and cinematic storytelling.',
    highlights: [
      'Animate believable motion arcs',
      'Develop timing & spacing intuition',
      'Polish renders with pro workflows'
    ],
    ctaLabel: 'Enroll Now'
  },
  {
    id: 9,
    title: 'Creative Writing Mastery: Craft Compelling Stories',
    image: '/coursesImages/9.png',
    rating: 4.1,
    ratingCount: 980,
    lessons: 6,
    durationMinutes: 300,
    level: 'Intermediate',
    author: 'Esther Howard',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: { previous: 199, current: 109 },
    summary:
      'Strengthen your narrative voice with practical storytelling frameworks and constructive critique.',
    highlights: [
      'Outline page-turning plots',
      'Create memorable characters',
      'Workshop chapters with peers'
    ],
    ctaLabel: 'Add to Cart'
  },
  {
    id: 10,
    title: 'Data Visualization with D3 & Observable',
    image: '/coursesImages/10.png',
    rating: 4.6,
    ratingCount: 1675,
    lessons: 7,
    durationMinutes: 390,
    level: 'Advanced',
    author: 'Devon Lane',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: { previous: 239, current: 139 },
    summary:
      'Tell powerful stories with interactive visualizations powered by D3, Observable, and modern tooling.',
    highlights: [
      'Design data-first narratives',
      'Build reusable chart components',
      'Deploy interactive dashboards'
    ],
    ctaLabel: 'Join the Cohort'
  },
  {
    id: 11,
    title: 'Product Strategy: From Discovery to Delivery',
    image: '/coursesImages/11.png',
    rating: 4.9,
    ratingCount: 2450,
    lessons: 6,
    durationMinutes: 340,
    level: 'Advanced',
    author: 'Leslie Alexander',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: { previous: 259, current: 149 },
    summary:
      'Align product teams around outcomes with actionable discovery frameworks and facilitation skills.',
    highlights: [
      'Run impactful discovery sessions',
      'Build outcome-driven roadmaps',
      'Measure success with clarity'
    ],
    ctaLabel: 'Enroll Now'
  },
  {
    id: 12,
    title: 'Full-Stack TypeScript with Next.js & GraphQL',
    image: '/coursesImages/12.png',
    rating: 4.7,
    ratingCount: 2120,
    lessons: 9,
    durationMinutes: 500,
    level: 'Advanced',
    author: 'Cameron Williamson',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: { previous: 279, current: 159 },
    summary:
      'Build production-grade SaaS apps with typed APIs, server actions, and performance-focused tooling.',
    highlights: [
      'Design resilient GraphQL schemas',
      'Automate E2E testing with Playwright',
      'Deploy globally with Vercel Edge'
    ],
    ctaLabel: 'Add to Cart'
  }
];

interface CourseDetailsPageProps {
  params: Promise<{ 'course-id': string }>;
}

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const { 'course-id': courseIdStr } = await params;
  const courseId = parseInt(courseIdStr);
  
  const course = COURSES.find(c => c.id === courseId);
  
  if (!course) {
    notFound();
  }
  
  // Get related courses (exclude current course)
  const relatedCourses = COURSES.filter(c => c.id !== courseId).slice(0, 3);
  
  return (
    <main className="w-full bg-white">
      <CourseHero course={course} />
      <CourseContent course={course} />
      <div id="related-courses-section">
        <RelatedCourses courses={relatedCourses} />
      </div>
    </main>
  );
}
