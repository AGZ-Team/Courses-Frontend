"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { 
  IconFileText, 
  IconBook, 
  IconChevronDown, 
  IconChevronRight,
  IconVideo,
  IconFile,
  IconCheck,
  IconX,
  IconEye
} from "@tabler/icons-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import type { Content, Lesson } from "@/types/content";
import type { Subcategory } from "@/types/subcategory";
import { fetchContent } from "@/services/contentService";
import { fetchLessons } from "@/services/lessonService";
import { fetchSubcategories } from "@/services/subcategoriesService";
import { useAuthStore } from "@/stores/authStore";

function StatusBadge({ published, isArabic }: { published: boolean; isArabic: boolean }) {
  return published ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-100">
      <IconCheck className="h-3 w-3" />
      {isArabic ? "منشور" : "Published"}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-gray-100">
      <IconX className="h-3 w-3" />
      {isArabic ? "مسودة" : "Draft"}
    </span>
  );
}

function MediaBadge({ hasVideo, hasFile, isArabic }: { hasVideo: boolean; hasFile: boolean; isArabic: boolean }) {
  return (
    <div className="flex gap-1">
      {hasVideo && (
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-700 ring-1 ring-purple-100">
          <IconVideo className="h-3 w-3" />
          {isArabic ? "فيديو" : "Video"}
        </span>
      )}
      {hasFile && (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 ring-1 ring-amber-100">
          <IconFile className="h-3 w-3" />
          {isArabic ? "ملف" : "File"}
        </span>
      )}
    </div>
  );
}

interface ContentWithLessonsDisplay extends Content {
  lessons: Lesson[];
  subcategoryName?: string;
}

export default function MyContentPanel() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [expandedContent, setExpandedContent] = useState<Set<number>>(new Set());
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [lessonSheetOpen, setLessonSheetOpen] = useState(false);

  // Get user from auth store for role checks
  const user = useAuthStore((state) => state.user);
  const isSuperuser = user?.is_superuser === true;
  const isInstructor = user?.is_instructor === true;

  const {
    data: contentList = [],
    isLoading: contentLoading,
    error: contentError,
  } = useQuery<Content[]>({
    queryKey: ["content"],
    queryFn: fetchContent,
  });

  const {
    data: lessonList = [],
    isLoading: lessonsLoading,
  } = useQuery<Lesson[]>({
    queryKey: ["lessons"],
    queryFn: fetchLessons,
  });

  const {
    data: subcategories = [],
  } = useQuery<Subcategory[]>({
    queryKey: ["subcategories"],
    queryFn: fetchSubcategories,
  });

  useEffect(() => {
    const handle = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 300);

    return () => {
      clearTimeout(handle);
    };
  }, [searchInput]);

  // Filter content based on user role (wait for hydration)
  const roleFilteredContent = useMemo(() => {
    if (!user) return [];
    
    // Superuser sees all content
    if (isSuperuser) {
      return contentList;
    }
    
    // Instructor sees only their own content
    if (isInstructor) {
      return contentList.filter(content => content.creator === user?.id);
    }
    
    // Normal user sees all published content (in future, filter by subscription)
    return contentList.filter(content => content.is_published);
  }, [contentList, isSuperuser, isInstructor, user?.id]);

  // Combine content with their lessons and search filter
  const contentWithLessons: ContentWithLessonsDisplay[] = useMemo(() => {
    const q = search.toLowerCase().trim();
    
    return roleFilteredContent
      .filter(content => {
        if (!q) return true;
        const contentLessons = lessonList.filter(l => l.content === content.id);
        return (
          content.name.toLowerCase().includes(q) ||
          content.description.toLowerCase().includes(q) ||
          contentLessons.some(lesson => 
            lesson.name.toLowerCase().includes(q) ||
            lesson.text.toLowerCase().includes(q)
          )
        );
      })
      .map(content => {
        const lessons = lessonList.filter(lesson => lesson.content === content.id);
        const subcategory = subcategories.find(s => s.id === content.subcategory);
        return {
          ...content,
          lessons,
          subcategoryName: subcategory 
            ? (isArabic ? subcategory.title_arabic : subcategory.title_english) 
            : undefined,
        };
      });
  }, [roleFilteredContent, lessonList, subcategories, search, isArabic]);

  const toggleContentExpand = (contentId: number) => {
    setExpandedContent(prev => {
      const newSet = new Set(prev);
      if (newSet.has(contentId)) {
        newSet.delete(contentId);
      } else {
        newSet.add(contentId);
      }
      return newSet;
    });
  };

  const openLessonDetails = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setLessonSheetOpen(true);
  };

  const loading = contentLoading || lessonsLoading;

  const getContentLabel = (lesson: Lesson) => {
    const match = contentList.find((content) => content.id === lesson.content);
    return match?.name || "-";
  };

  // Role-based header text
  const headerTitle = isArabic
    ? isSuperuser
      ? "جميع المحتويات"
      : isInstructor
      ? "محتواي"
      : "المحتويات المتاحة"
    : isSuperuser
    ? "All Content"
    : isInstructor
    ? "My Content"
    : "Available Content";

  const headerDescription = isArabic
    ? isSuperuser
      ? "عرض جميع المحتويات والدروس في النظام"
      : isInstructor
      ? "عرض المحتويات والدروس التي قمت بإنشائها"
      : "عرض المحتويات والدروس المتاحة لك"
    : isSuperuser
    ? "View all content and lessons in the system"
    : isInstructor
    ? "View content and lessons you have created"
    : "View content and lessons available to you";

  return (
    <div className="px-4 lg:px-6" dir="ltr">
      <div className="mb-6 space-y-1 max-w-6xl mx-auto" dir={isArabic ? "rtl" : "ltr"}>
        <h1 className="text-2xl font-semibold text-[#0b0b2b]">
          {headerTitle}
        </h1>
        <p className="text-sm text-gray-500">
          {headerDescription}
        </p>
      </div>

      <Card className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-gray-100 bg-white/95 shadow-[0_10px_40px_rgba(13,13,18,0.05)] transition-shadow duration-200 hover:shadow-[0_18px_55px_rgba(13,13,18,0.07)]">
        <CardHeader
          dir={isArabic ? "rtl" : "ltr"}
          className="flex flex-col gap-4 border-b border-gray-100 bg-linear-to-r from-teal-50/80 via-white to-sky-50/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className={`space-y-1 ${isArabic ? "text-right" : "text-left"}`}>
            <CardTitle className="text-base font-semibold text-[#0b0b2b]">
              {isArabic ? "المحتويات والدروس" : "Content & Lessons"}
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              {isArabic
                ? `${contentWithLessons.length} محتوى • ${contentWithLessons.reduce((acc, c) => acc + c.lessons.length, 0)} درس`
                : `${contentWithLessons.length} content • ${contentWithLessons.reduce((acc, c) => acc + c.lessons.length, 0)} lessons`}
            </CardDescription>
          </div>
          <div className="w-full sm:w-auto sm:min-w-[220px]">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={
                isArabic
                  ? "ابحث في المحتويات والدروس..."
                  : "Search content and lessons..."
              }
              className="h-9 w-full rounded-full border border-teal-100 bg-white/90 px-3 text-xs text-gray-800 shadow-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-80 items-center justify-center">
              <Spinner />
            </div>
          ) : contentError ? (
            <div className="flex h-80 items-center justify-center">
              <p className="text-red-500 text-sm">
                {isArabic ? "فشل في تحميل المحتوى" : "Failed to load content"}
              </p>
            </div>
          ) : contentWithLessons.length === 0 ? (
            <div className="flex h-80 flex-col items-center justify-center gap-3">
              <IconFileText className="h-16 w-16 text-gray-300" />
              <p className="text-gray-500 text-sm">
                {isArabic
                  ? search
                    ? "لا توجد نتائج للبحث"
                    : "لا يوجد محتوى متاح"
                  : search
                  ? "No search results"
                  : "No content available"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {contentWithLessons.map((content) => (
                <div key={content.id} className="group">
                  {/* Content Row */}
                  <div 
                    className="flex items-center justify-between px-4 py-4 hover:bg-gray-50/50 cursor-pointer transition-colors"
                    onClick={() => toggleContentExpand(content.id)}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary/20"
                      >
                        {expandedContent.has(content.id) ? (
                          <IconChevronDown className="h-4 w-4" />
                        ) : (
                          <IconChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-primary/10 to-primary/5">
                        <IconFileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-[#0b0b2b] truncate">
                            {content.name}
                          </h3>
                          <StatusBadge published={content.is_published} isArabic={isArabic} />
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          {content.subcategoryName && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5">
                              {content.subcategoryName}
                            </span>
                          )}
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <IconBook className="h-3 w-3" />
                            {content.lessons.length} {isArabic ? "درس" : "lessons"}
                          </span>
                          <span>•</span>
                          <span className="font-medium text-primary">
                            ${content.price.toFixed(2)}
                          </span>
                          {content.creator_name && (
                            <>
                              <span>•</span>
                              <span className="text-gray-400">
                                {isArabic ? "بواسطة" : "by"} {content.creator_name}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Lessons */}
                  {expandedContent.has(content.id) && (
                    <div className="bg-gray-50/50 border-t border-gray-100">
                      {content.lessons.length === 0 ? (
                        <div className="px-4 py-6 text-center">
                          <IconBook className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                          <p className="text-sm text-gray-500">
                            {isArabic ? "لا توجد دروس" : "No lessons yet"}
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {content.lessons.map((lesson, index) => (
                            <div 
                              key={lesson.id}
                              className="flex items-center justify-between px-4 py-3 pl-20 hover:bg-gray-100/50 transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-600">
                                  {index + 1}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-medium text-sm text-gray-800 truncate">
                                    {lesson.name}
                                  </h4>
                                  <p className="text-xs text-gray-500 truncate mt-0.5">
                                    {lesson.text.slice(0, 100)}{lesson.text.length > 100 ? "..." : ""}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 ml-4">
                                <MediaBadge 
                                  hasVideo={!!lesson.video} 
                                  hasFile={!!lesson.file}
                                  isArabic={isArabic}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="rounded-full h-8 w-8 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openLessonDetails(lesson);
                                  }}
                                >
                                  <IconEye className="h-4 w-4 text-gray-500" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lesson Details Sheet */}
      <Sheet open={lessonSheetOpen} onOpenChange={setLessonSheetOpen}>
        <SheetContent
          side="right"
          closePosition={isArabic ? "left" : "right"}
          dir={isArabic ? "rtl" : "ltr"}
          className="w-full sm:max-w-md"
        >
          <SheetHeader className={isArabic ? "text-right" : "text-left"}>
            <SheetTitle>{isArabic ? "تفاصيل الدرس" : "Lesson Details"}</SheetTitle>
            <SheetDescription>
              {isArabic ? "عرض معلومات الدرس" : "View lesson information"}
            </SheetDescription>
          </SheetHeader>

          {selectedLesson && (
            <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <Label className="text-[11px] text-gray-500">
                    {isArabic ? "المعرف" : "ID"}
                  </Label>
                  <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                    {selectedLesson.id}
                  </div>
                </div>
                <div>
                  <Label className="text-[11px] text-gray-500">
                    {isArabic ? "المحتوى" : "Content"}
                  </Label>
                  <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                    {getContentLabel(selectedLesson)}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-[11px] text-gray-500">
                  {isArabic ? "الاسم" : "Name"}
                </Label>
                <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                  {selectedLesson.name}
                </div>
              </div>

              <div>
                <Label className="text-[11px] text-gray-500">
                  {isArabic ? "النص" : "Text"}
                </Label>
                <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800 whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {selectedLesson.text || "-"}
                </div>
              </div>

              {/* Video */}
              <div>
                <Label className="text-[11px] text-gray-500">
                  {isArabic ? "الفيديو" : "Video"}
                </Label>
                <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                  {selectedLesson.video ? (
                    <a 
                      href={selectedLesson.video} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <IconVideo className="h-4 w-4" />
                      {isArabic ? "عرض الفيديو" : "View Video"}
                    </a>
                  ) : (
                    <span className="text-gray-400">{isArabic ? "لا يوجد فيديو" : "No video"}</span>
                  )}
                </div>
              </div>

              {/* File */}
              <div>
                <Label className="text-[11px] text-gray-500">
                  {isArabic ? "الملف" : "File"}
                </Label>
                <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                  {selectedLesson.file ? (
                    <a 
                      href={selectedLesson.file} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <IconFile className="h-4 w-4" />
                      {isArabic ? "تحميل الملف" : "Download File"}
                    </a>
                  ) : (
                    <span className="text-gray-400">{isArabic ? "لا يوجد ملف" : "No file"}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="px-4 pb-4">
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full"
              onClick={() => setLessonSheetOpen(false)}
            >
              {isArabic ? "إغلاق" : "Close"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
