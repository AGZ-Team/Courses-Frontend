"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { IconDotsVertical, IconVideo, IconFile, IconFileText } from "@tabler/icons-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import type { Content, Lesson, LessonInput } from "@/types/content";
import { fetchContent } from "@/services/contentService";
import { fetchLessons, createLesson, updateLesson, deleteLesson } from "@/services/lessonService";
import { useAuthStore } from "@/stores/authStore";

function ContentBadge({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-100">
      <IconFileText className="h-3 w-3" />
      {value || "-"}
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
      {!hasVideo && !hasFile && (
        <span className="text-xs text-gray-400">-</span>
      )}
    </div>
  );
}

export default function LessonPanel() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"view" | "edit" | "create">("view");
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [editValues, setEditValues] = useState<Partial<LessonInput> | null>(null);
  const [sheetSaving, setSheetSaving] = useState(false);
  const [sheetError, setSheetError] = useState<string | null>(null);

  const [visibleCount, setVisibleCount] = useState(20);
  const [deleteLessonState, setDeleteLessonState] = useState<Lesson | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState<number | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  // Get user from auth store for role checks
  const user = useAuthStore((state) => state.user);
  const isSuperuser = user?.is_superuser === true;
  const isInstructor = user?.is_instructor === true;

  const queryClient = useQueryClient();
  const {
    data: contentList = [],
    isLoading: contentLoading,
  } = useQuery<Content[]>({
    queryKey: ["content"],
    queryFn: fetchContent,
  });
  const {
    data: lessonList = [],
    isLoading: loading,
    error: queryError,
  } = useQuery<Lesson[]>({
    queryKey: ["lessons"],
    queryFn: fetchLessons,
  });

  useEffect(() => {
    if (queryError instanceof Error) {
      setError(queryError.message);
    }
  }, [queryError]);

  useEffect(() => {
    setVisibleCount(20);
  }, [search]);

  useEffect(() => {
    const handle = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 300);

    return () => {
      clearTimeout(handle);
    };
  }, [searchInput]);

  // First, filter content by user role (since backend doesn't filter)
  // - Superusers see ALL content
  // - Instructors see their own content only
  const roleFilteredContent = useMemo(() => {
    if (!user) return [];
    
    if (isSuperuser) {
      return contentList;
    }
    
    if (isInstructor) {
      return contentList.filter((content) => content.creator === user.id);
    }
    
    return [];
  }, [contentList, user, isSuperuser, isInstructor]);

  // Filter lessons based on role-filtered content
  // Lessons are shown if they belong to content the user can access
  const roleFilteredLessons = useMemo(() => {
    if (!user) return [];
    
    const allowedContentIds = new Set(roleFilteredContent.map(c => c.id));
    return lessonList.filter((lesson) => allowedContentIds.has(lesson.content));
  }, [lessonList, roleFilteredContent, user]);

  // Then apply search filter on top of role-filtered lessons
  const filteredLessons = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return roleFilteredLessons;

    return roleFilteredLessons.filter((lesson) => {
      return (
        lesson.name.toLowerCase().includes(q) ||
        lesson.text.toLowerCase().includes(q)
      );
    });
  }, [roleFilteredLessons, search]);

  const displayedLessons = useMemo(
    () => filteredLessons.slice(0, visibleCount),
    [filteredLessons, visibleCount],
  );

  const totalLessons = lessonList.length;
  const visibleLessonCount = displayedLessons.length;
  const hasMore = filteredLessons.length > visibleLessonCount;

  const getContentLabel = (lesson: Lesson) => {
    const match = contentList.find((content) => content.id === lesson.content);
    if (!match) return lesson.content_name || "-";
    return match.name || "-";
  };

  // Get the content object for a lesson (to check creator)
  const getContentForLesson = (lesson: Lesson): Content | undefined => {
    return contentList.find((content) => content.id === lesson.content);
  };

  const handleOpenSheet = (mode: "view" | "edit" | "create", lesson?: Lesson) => {
    setSheetMode(mode);
    setSheetError(null);
    setVideoFile(null);
    setAttachmentFile(null);

    if (mode === "create") {
      setActiveLesson(null);
      setEditValues({ 
        name: "", 
        text: "", 
      });
      // Default to first content the user has access to
      setSelectedContentId(roleFilteredContent.length > 0 ? roleFilteredContent[0].id : null);
    } else if (lesson) {
      setActiveLesson(lesson);
      const existingContentId = typeof lesson.content === "number" ? lesson.content : null;
      setSelectedContentId(existingContentId ?? (roleFilteredContent.length > 0 ? roleFilteredContent[0].id : null));
      if (mode === "edit") {
        setEditValues({ 
          name: lesson.name,
          text: lesson.text,
          content: lesson.content,
        });
      } else {
        setEditValues(null);
      }
    }

    setSheetOpen(true);
  };

  const handleEditFieldChange = (field: keyof LessonInput, value: string | number) => {
    setEditValues((prev) => ({ ...(prev ?? {}), [field]: value }));
  };

  const handleSaveLesson = async () => {
    if (!editValues) return;

    try {
      setSheetError(null);

      if (!selectedContentId) {
        setSheetError(
          isArabic
            ? "يرجى اختيار المحتوى قبل الحفظ."
            : "Please select content before saving.",
        );
        return;
      }

      if (!editValues.name?.trim()) {
        setSheetError(
          isArabic
            ? "يرجى إدخال اسم الدرس."
            : "Please enter a lesson name.",
        );
        return;
      }

      setSheetSaving(true);

      if (sheetMode === "create") {
        const payload: LessonInput = {
          name: editValues.name?.trim() ?? "",
          text: editValues.text?.trim() ?? "",
          content: selectedContentId,
          video: videoFile,
          file: attachmentFile,
        };

        const created = await createLesson(payload);
        queryClient.setQueryData<Lesson[]>(["lessons"], (prev) =>
          prev ? [...prev, created] : [created],
        );
        setActiveLesson(created);
      } else if (sheetMode === "edit" && activeLesson) {
        const payload: Partial<LessonInput> = {
          name: (editValues.name ?? activeLesson.name).trim(),
          text: (editValues.text ?? activeLesson.text).trim(),
          content: selectedContentId,
          video: videoFile,
          file: attachmentFile,
        };

        const updated = await updateLesson(activeLesson.id, payload);
        queryClient.setQueryData<Lesson[]>(["lessons"], (prev) =>
          prev ? prev.map((l) => (l.id === updated.id ? updated : l)) : [updated],
        );
        setActiveLesson(updated);
      }

      setSheetOpen(false);
    } catch (err) {
      setSheetError(err instanceof Error ? err.message : "Failed to save lesson");
    } finally {
      setSheetSaving(false);
    }
  };

  const openDeleteDialog = (lesson: Lesson) => {
    setDeleteLessonState(lesson);
    setDeleteOpen(true);
    setError(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteLessonState) return;

    try {
      setDeleteSaving(true);
      setError(null);
      await deleteLesson(deleteLessonState.id);

      queryClient.setQueryData<Lesson[]>(["lessons"], (prev) =>
        prev ? prev.filter((l) => l.id !== deleteLessonState.id) : [],
      );

      if (activeLesson && activeLesson.id === deleteLessonState.id) {
        setActiveLesson(null);
        setSheetOpen(false);
      }

      setDeleteOpen(false);
      setDeleteLessonState(null);
      setDeleteSaving(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete lesson");
      setDeleteSaving(false);
    }
  };

  // Check if user can edit/delete this lesson (based on content creator)
  const canModifyLesson = (lesson: Lesson) => {
    if (isSuperuser) return true;
    const content = getContentForLesson(lesson);
    return content?.creator === user?.id;
  };

  const sheetTitleText = isArabic
    ? sheetMode === "view"
      ? "تفاصيل الدرس"
      : sheetMode === "edit"
      ? "تعديل الدرس"
      : "إنشاء درس"
    : sheetMode === "view"
    ? "Lesson details"
    : sheetMode === "edit"
    ? "Edit lesson"
    : "Create lesson";

  const sheetDescriptionText = isArabic
    ? sheetMode === "view"
      ? "راجع جميع معلومات الدرس."
      : sheetMode === "edit"
      ? "قم بتحديث معلومات الدرس ثم احفظ التغييرات."
      : "أنشئ درس جديد للمحتوى."
    : sheetMode === "view"
    ? "Review the full lesson information."
    : sheetMode === "edit"
    ? "Update the lesson information and save the changes."
    : "Create a new lesson for content.";

  const sheetPrimaryButtonText = sheetSaving
    ? isArabic
      ? "جارٍ الحفظ..."
      : "Saving..."
    : sheetMode === "edit"
    ? isArabic
      ? "حفظ التغييرات"
      : "Save changes"
    : isArabic
    ? "حفظ الدرس"
    : "Save";

  return (
    <div className="px-4 lg:px-6" dir="ltr">
      <div className="mb-6 space-y-1 max-w-6xl mx-auto" dir={isArabic ? "rtl" : "ltr"}>
        <h1 className="text-2xl font-semibold text-[#0b0b2b]">
          {isArabic ? "إدارة الدروس" : "Lesson Management"}
        </h1>
        <p className="text-sm text-gray-500">
          {isArabic
            ? "إدارة دروس المحتوى، بما في ذلك الأسماء والنصوص والفيديو والملفات."
            : "Manage content lessons, including names, text, videos, and files."}
        </p>
      </div>

      <Card className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-gray-100 bg-white/95 shadow-[0_10px_40px_rgba(13,13,18,0.05)] transition-shadow duration-200 hover:shadow-[0_18px_55px_rgba(13,13,18,0.07)]">
        <CardHeader
          dir={isArabic ? "rtl" : "ltr"}
          className="flex flex-col gap-4 border-b border-gray-100 bg-linear-to-r from-teal-50/80 via-white to-sky-50/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className={`space-y-1 ${isArabic ? "text-right" : "text-left"}`}>
            <CardTitle className="text-base font-semibold text-[#0b0b2b]">
              {isArabic ? "دليل الدروس" : "Lesson directory"}
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              {isArabic
                ? "متصل بواجهة برمجة تطبيقات الدروس الخاصة بلوحة التحكم مع البحث والإجراءات السريعة."
                : "Connected to your admin lessons API with search and quick actions."}
            </CardDescription>
          </div>
          <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <div className="inline-flex w-fit items-center justify-center gap-2 self-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-teal-800 shadow-sm ring-1 ring-teal-100/80">
              <span className="mr-1 text-[10px] uppercase tracking-wide text-teal-500">
                {isArabic ? "الدروس" : "Lessons"}
              </span>
              <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-700">
                {visibleLessonCount}
              </span>
              <span className="mx-1 text-[10px] text-gray-400">{isArabic ? "من" : "of"}</span>
              <span className="text-[11px] text-gray-700">{totalLessons}</span>
            </div>
            <div className="w-full sm:w-auto sm:min-w-[220px] flex items-center gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={
                  isArabic
                    ? "ابحث بالاسم أو النص"
                    : "Search by name or text"
                }
                className="h-9 w-full rounded-full border border-teal-100 bg-white/90 px-3 text-xs text-gray-800 shadow-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
              />
              <Button
                type="button"
                size="sm"
                disabled={!user || roleFilteredContent.length === 0}
                className="rounded-full bg-primary px-5 sm:px-6 text-[11px] font-medium text-white shadow-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleOpenSheet("create")}
              >
                {locale === "ar" ? "إضافة درس جديد" : "Add new lesson"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-80 items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <div className="max-h-[560px] overflow-y-auto">
                  <Table className="min-w-full table-auto border-separate border-spacing-0 text-xs md:text-sm">
                    <TableHeader>
                      <TableRow className="sticky top-0 z-10 bg-gray-50/95 text-[11px] uppercase tracking-wide text-gray-500 backdrop-blur">
                        <TableHead className="border-b border-gray-100 px-3 py-3 text-left font-semibold text-[12px] w-12">
                          ID
                        </TableHead>
                        <TableHead className="border-b border-gray-100 px-3 py-3 text-left font-semibold text-[12px]">
                          {isArabic ? "الاسم" : "Name"}
                        </TableHead>
                        <TableHead className="border-b border-gray-100 px-3 py-3 text-left font-semibold text-[12px]">
                          {isArabic ? "المحتوى" : "Content"}
                        </TableHead>
                        <TableHead className="border-b border-gray-100 px-3 py-3 text-left font-semibold text-[12px]">
                          {isArabic ? "الوسائط" : "Media"}
                        </TableHead>
                        <TableHead className="border-b border-gray-100 px-3 py-3 text-left font-semibold text-[12px] w-20">
                          {isArabic ? "الإجراءات" : "Actions"}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedLessons.map((lesson) => (
                        <TableRow
                          key={lesson.id}
                          className="border-t border-gray-50 odd:bg-white even:bg-gray-50/40 hover:bg-teal-50/40 transition-colors"
                        >
                          <TableCell className="px-3 py-3 align-middle text-xs text-gray-500">
                            {lesson.id}
                          </TableCell>
                          <TableCell className="px-3 py-3 align-middle text-xs text-gray-900">
                            <div className="max-w-[200px] truncate font-medium">
                              {lesson.name}
                            </div>
                          </TableCell>
                          <TableCell className="px-3 py-3 align-middle text-xs text-gray-900">
                            <ContentBadge value={getContentLabel(lesson)} />
                          </TableCell>
                          <TableCell className="px-3 py-3 align-middle text-xs">
                            <MediaBadge 
                              hasVideo={!!lesson.video} 
                              hasFile={!!lesson.file} 
                              isArabic={isArabic}
                            />
                          </TableCell>
                          <TableCell className="px-3 py-3 align-middle text-xs text-gray-700">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  type="button"
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-teal-300 hover:text-teal-600 hover:shadow-md"
                                >
                                  <IconDotsVertical className="h-4 w-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-36 rounded-lg">
                                <DropdownMenuItem
                                  className="text-xs"
                                  onClick={() => handleOpenSheet("view", lesson)}
                                >
                                  {isArabic ? "عرض التفاصيل" : "View details"}
                                </DropdownMenuItem>
                                {canModifyLesson(lesson) && (
                                  <>
                                    <DropdownMenuItem
                                      className="text-xs"
                                      onClick={() => handleOpenSheet("edit", lesson)}
                                    >
                                      {isArabic ? "تعديل" : "Edit lesson"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-xs text-red-600 focus:text-red-600"
                                      onClick={() => openDeleteDialog(lesson)}
                                    >
                                      {isArabic ? "حذف" : "Delete"}
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-3 px-4 py-4 md:hidden">
                {displayedLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-px hover:shadow-md"
                  >
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="font-mono text-[11px] text-gray-600">ID {lesson.id}</span>
                      <MediaBadge 
                        hasVideo={!!lesson.video} 
                        hasFile={!!lesson.file} 
                        isArabic={isArabic}
                      />
                    </div>
                    <div className="mt-2 flex flex-col gap-1 text-xs text-gray-700">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-500">{isArabic ? "الاسم" : "Name"}</span>
                        <span className="max-w-[60%] truncate text-right text-gray-800 font-medium">
                          {lesson.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-500">{isArabic ? "المحتوى" : "Content"}</span>
                        <span className="max-w-[60%] truncate text-right text-gray-800">
                          {getContentLabel(lesson)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full px-3 text-[11px]"
                        onClick={() => handleOpenSheet("view", lesson)}
                      >
                        {isArabic ? "عرض" : "View"}
                      </Button>
                      {canModifyLesson(lesson) && (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-full px-3 text-[11px]"
                            onClick={() => handleOpenSheet("edit", lesson)}
                          >
                            {isArabic ? "تعديل" : "Edit"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-full px-3 text-[11px] text-red-600 hover:text-red-700"
                            onClick={() => openDeleteDialog(lesson)}
                          >
                            {isArabic ? "حذف" : "Delete"}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {!loading && hasMore && (
            <div className="border-t border-gray-100 px-4 py-3 text-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full px-4 text-xs"
                onClick={() => setVisibleCount((prev) => prev + 20)}
              >
                {isArabic ? "تحميل المزيد" : "Load more lessons"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {deleteOpen && deleteLessonState && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !deleteSaving) {
              setDeleteOpen(false);
              setDeleteLessonState(null);
            }
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">
                {isArabic ? "حذف الدرس" : "Delete lesson"}
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                {isArabic
                  ? `هل أنت متأكد من حذف "${deleteLessonState.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
                  : `Are you sure you want to delete "${deleteLessonState.name}"? This action cannot be undone.`}
              </p>
            </div>
            {error && (
              <div className="mx-5 mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                {error}
              </div>
            )}
            <div className="flex items-center justify-end gap-2 px-5 py-3">
              <Button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteSaving}
                className="rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteSaving ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/80 border-t-transparent" />
                    <span>{isArabic ? "جارٍ الحذف..." : "Deleting..."}</span>
                  </span>
                ) : (
                  isArabic ? "حذف" : "Delete"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                disabled={deleteSaving}
                onClick={() => {
                  setDeleteOpen(false);
                  setDeleteLessonState(null);
                  setError(null);
                }}
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          closePosition={isArabic ? "left" : "right"}
          dir={isArabic ? "rtl" : "ltr"}
          className="w-full sm:max-w-md"
        >
          <SheetHeader className={isArabic ? "text-right" : "text-left"}>
            <SheetTitle>{sheetTitleText}</SheetTitle>
            <SheetDescription>{sheetDescriptionText}</SheetDescription>
          </SheetHeader>

          {sheetError && (
            <div className="mx-4 mb-2 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
              {sheetError}
            </div>
          )}

          {(activeLesson || sheetMode === "create") && (
            <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4">
              {activeLesson && sheetMode !== "create" && (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <Label className="text-[11px] text-gray-500">
                      {isArabic ? "المعرف" : "ID"}
                    </Label>
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                      {activeLesson.id}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 text-xs">
                <div>
                  <Label className="text-[11px] text-gray-500">
                    {isArabic ? "الاسم" : "Name"}
                  </Label>
                  {sheetMode === "view" && activeLesson ? (
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                      {activeLesson.name || "-"}
                    </div>
                  ) : (
                    <Input
                      value={editValues?.name ?? ""}
                      onChange={(e) => handleEditFieldChange("name", e.target.value)}
                      className="mt-1 h-8 text-[13px]"
                      placeholder={isArabic ? "أدخل اسم الدرس" : "Enter lesson name"}
                    />
                  )}
                </div>
                <div>
                  <Label className="text-[11px] text-gray-500">
                    {isArabic ? "النص" : "Text"}
                  </Label>
                  {sheetMode === "view" && activeLesson ? (
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800 whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {activeLesson.text || "-"}
                    </div>
                  ) : (
                    <Textarea
                      value={editValues?.text ?? ""}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleEditFieldChange("text", e.target.value)}
                      className="mt-1 text-[13px] min-h-20"
                      placeholder={isArabic ? "أدخل نص الدرس" : "Enter lesson text"}
                    />
                  )}
                </div>
                <div>
                  <Label className="text-[11px] text-gray-500">
                    {isArabic ? "المحتوى" : "Content"}
                  </Label>
                  {sheetMode === "view" && activeLesson ? (
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                      {getContentLabel(activeLesson)}
                    </div>
                  ) : (
                    <select
                      value={selectedContentId ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedContentId(value ? Number(value) : null);
                      }}
                      className="mt-1 h-8 w-full rounded-md border border-gray-200 bg-white px-2 text-[13px] text-gray-800 shadow-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                      disabled={contentLoading || contentList.length === 0}
                    >
                      <option value="">
                        {contentLoading
                          ? isArabic
                            ? "جاري تحميل المحتوى..."
                            : "Loading content..."
                          : isArabic
                          ? "اختر المحتوى"
                          : "Select content"}
                      </option>
                      {roleFilteredContent.map((content) => (
                        <option key={content.id} value={content.id}>
                          {content.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                
                {/* Video Upload */}
                <div>
                  <Label className="text-[11px] text-gray-500">
                    {isArabic ? "الفيديو" : "Video"}
                  </Label>
                  {sheetMode === "view" && activeLesson ? (
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                      {activeLesson.video ? (
                        <a 
                          href={activeLesson.video} 
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
                  ) : (
                    <div className="mt-1">
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                        className="h-8 text-[13px]"
                      />
                      {videoFile && (
                        <p className="mt-1 text-[11px] text-gray-500">
                          {isArabic ? "تم اختيار:" : "Selected:"} {videoFile.name}
                        </p>
                      )}
                      {activeLesson?.video && !videoFile && (
                        <p className="mt-1 text-[11px] text-gray-500">
                          {isArabic ? "الفيديو الحالي سيبقى" : "Current video will be kept"}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* File Upload */}
                <div>
                  <Label className="text-[11px] text-gray-500">
                    {isArabic ? "الملف" : "File"}
                  </Label>
                  {sheetMode === "view" && activeLesson ? (
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                      {activeLesson.file ? (
                        <a 
                          href={activeLesson.file} 
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
                  ) : (
                    <div className="mt-1">
                      <Input
                        type="file"
                        onChange={(e) => setAttachmentFile(e.target.files?.[0] ?? null)}
                        className="h-8 text-[13px]"
                      />
                      {attachmentFile && (
                        <p className="mt-1 text-[11px] text-gray-500">
                          {isArabic ? "تم اختيار:" : "Selected:"} {attachmentFile.name}
                        </p>
                      )}
                      {activeLesson?.file && !attachmentFile && (
                        <p className="mt-1 text-[11px] text-gray-500">
                          {isArabic ? "الملف الحالي سيبقى" : "Current file will be kept"}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <SheetFooter>
            {sheetMode === "view" ? (
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-full"
                onClick={() => setSheetOpen(false)}
              >
                {isArabic ? "إغلاق" : "Close"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSaveLesson}
                disabled={sheetSaving}
                className="w-full rounded-full bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
              >
                {sheetPrimaryButtonText}
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
