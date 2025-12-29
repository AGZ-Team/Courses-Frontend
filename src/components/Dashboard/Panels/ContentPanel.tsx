"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { IconDotsVertical, IconCheck, IconX } from "@tabler/icons-react";

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
import { Switch } from "@/components/ui/switch";
import type { Content, ContentInput } from "@/types/content";
import type { Subcategory } from "@/types/subcategory";
import { fetchSubcategories } from "@/services/subcategoriesService";
import { fetchContent, createContent, updateContent, deleteContent } from "@/services/contentService";
import { useAuthStore } from "@/stores/authStore";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuthHydrated } from "@/hooks/useAuthHydrated";

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

export default function ContentPanel() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"view" | "edit" | "create">("view");
  const [activeContent, setActiveContent] = useState<Content | null>(null);
  const [editValues, setEditValues] = useState<Partial<ContentInput> | null>(null);
  const [sheetSaving, setSheetSaving] = useState(false);
  const [sheetError, setSheetError] = useState<string | null>(null);

  const [visibleCount, setVisibleCount] = useState(20);
  const [deleteContentState, setDeleteContentState] = useState<Content | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);

  // Get user from auth store for role checks
  // Also use useUserProfile to ensure profile data is loaded
  // And check if auth store has been hydrated from localStorage
  const isHydrated = useAuthHydrated();
  const { loading: userLoading, refetch: refetchUserProfile } = useUserProfile();
  const user = useAuthStore((state) => state.user);
  const isSuperuser = user?.is_superuser === true;
  const isInstructor = user?.is_instructor === true;

  // Combined loading state: not ready until hydrated AND not loading
  const isUserReady = isHydrated && !userLoading && user?.id;

  const queryClient = useQueryClient();
  const {
    data: subcategories = [],
    isLoading: subcategoriesLoading,
  } = useQuery<Subcategory[]>({
    queryKey: ["subcategories"],
    queryFn: fetchSubcategories,
  });
  const {
    data: contentList = [],
    isLoading: loading,
    error: queryError,
  } = useQuery<Content[]>({
    queryKey: ["content"],
    queryFn: fetchContent,
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
  // - Normal users shouldn't be on this panel, but if they are, show nothing
  const roleFilteredContent = useMemo(() => {
    if (!user) return [];

    if (isSuperuser) {
      // Superusers see everything
      return contentList;
    }

    if (isInstructor) {
      // Instructors see only their own content
      return contentList.filter((content) => content.creator === user.id);
    }

    // Normal users shouldn't see this panel - return empty
    return [];
  }, [contentList, user, isSuperuser, isInstructor]);

  // Then apply search filter on top of role-filtered content
  const filteredContent = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return roleFilteredContent;

    return roleFilteredContent.filter((content) => {
      return (
        content.name.toLowerCase().includes(q) ||
        content.description.toLowerCase().includes(q)
      );
    });
  }, [roleFilteredContent, search]);

  const displayedContent = useMemo(
    () => filteredContent.slice(0, visibleCount),
    [filteredContent, visibleCount],
  );

  const totalContent = contentList.length;
  const visibleContentCount = displayedContent.length;
  const hasMore = filteredContent.length > visibleContentCount;

  const getSubcategoryLabel = (content: Content) => {
    const match = subcategories.find((subcategory) => subcategory.id === content.subcategory);
    if (!match) return "-";
    return isArabic ? match.title_arabic || "-" : match.title_english || "-";
  };

  const handleOpenSheet = (mode: "view" | "edit" | "create", content?: Content) => {
    setSheetMode(mode);
    setSheetError(null);

    if (mode === "create") {
      setActiveContent(null);
      setEditValues({
        name: "",
        description: "",
        price: 0,
        is_published: false
      });
      setSelectedSubcategoryId(subcategories.length > 0 ? subcategories[0].id : null);
    } else if (content) {
      setActiveContent(content);
      const existingSubcategoryId = typeof content.subcategory === "number" ? content.subcategory : null;
      setSelectedSubcategoryId(existingSubcategoryId ?? (subcategories.length > 0 ? subcategories[0].id : null));
      if (mode === "edit") {
        setEditValues({
          name: content.name,
          description: content.description,
          price: content.price,
          is_published: content.is_published,
          subcategory: content.subcategory,
        });
      } else {
        setEditValues(null);
      }
    }

    setSheetOpen(true);
  };

  const handleEditFieldChange = (field: keyof ContentInput, value: string | number | boolean) => {
    // Handle price field - round to 2 decimal places automatically
    if (field === "price" && typeof value === "number") {
      // Round to 2 decimal places (best practice for currency)
      value = Math.round(value * 100) / 100;
    }
    setEditValues((prev) => ({ ...(prev ?? {}), [field]: value }));
  };

  const handleSaveContent = async () => {
    if (!editValues) return;

    try {
      setSheetError(null);

      if (!selectedSubcategoryId) {
        setSheetError(
          isArabic
            ? "يرجى اختيار فئة فرعية قبل الحفظ."
            : "Please select a subcategory before saving.",
        );
        return;
      }

      if (!editValues.name?.trim()) {
        setSheetError(
          isArabic
            ? "يرجى إدخال اسم المحتوى."
            : "Please enter a content name.",
        );
        return;
      }

      setSheetSaving(true);

      if (sheetMode === "create") {
        // Verify user is loaded before creating
        if (!user?.id) {
          console.log('[ContentPanel] User ID missing, attempting to refresh profile...');
          // Try to refetch user profile automatically
          try {
            await refetchUserProfile();
          } catch (refetchError) {
            console.error('[ContentPanel] Failed to refetch user profile:', refetchError);
          }

          // Check again after refetch attempt
          const currentUser = useAuthStore.getState().user;
          if (!currentUser?.id) {
            setSheetError(
              isArabic
                ? "خطأ: لم يتم تحميل بيانات المستخدم. يرجى تسجيل الخروج وإعادة تسجيل الدخول."
                : "Error: User session expired. Please log out and log back in.",
            );
            setSheetSaving(false);
            return;
          }
        }

        // Get the latest user data from store (in case we just refetched)
        const currentUser = useAuthStore.getState().user;
        console.log('[ContentPanel] User object:', { id: currentUser?.id, name: currentUser?.first_name });

        const payload: ContentInput = {
          name: editValues.name?.trim() ?? "",
          description: editValues.description?.trim() ?? "",
          subcategory: selectedSubcategoryId,
          creator: currentUser!.id, // Backend requires this field - we've already verified it exists above
          price: Number(editValues.price) || 0,
          is_published: editValues.is_published ?? false,
        };

        console.log('[ContentPanel] Final payload before sending:', JSON.stringify(payload, null, 2));

        const created = await createContent(payload);
        queryClient.setQueryData<Content[]>(["content"], (prev) =>
          prev ? [...prev, created] : [created],
        );
        setActiveContent(created);
      } else if (sheetMode === "edit" && activeContent) {
        const payload: Partial<ContentInput> = {
          name: (editValues.name ?? activeContent.name).trim(),
          description: (editValues.description ?? activeContent.description).trim(),
          subcategory: selectedSubcategoryId,
          price: Number(editValues.price ?? activeContent.price) || 0,
          is_published: editValues.is_published ?? activeContent.is_published,
        };

        const updated = await updateContent(activeContent.id, payload);
        queryClient.setQueryData<Content[]>(["content"], (prev) =>
          prev ? prev.map((c) => (c.id === updated.id ? updated : c)) : [updated],
        );
        setActiveContent(updated);
      }

      setSheetOpen(false);
    } catch (err) {
      // Parse backend validation errors
      let errorMessage = "Failed to save content";

      if (err instanceof Error) {
        // Try to parse structured error messages from backend
        if (err.message.includes("price")) {
          errorMessage = isArabic
            ? "السعر يجب أن يحتوي على رقمين عشريين كحد أقصى (مثال: 99.99)"
            : "Price must not exceed 2 decimal places (e.g., 99.99)";
        } else if (err.message.includes("Ensure that there are no more than 2 decimal places")) {
          errorMessage = isArabic
            ? "السعر يجب أن يحتوي على رقمين عشريين كحد أقصى (مثال: 99.99)"
            : "Price must not exceed 2 decimal places (e.g., 99.99)";
        } else {
          errorMessage = err.message;
        }
      }

      setSheetError(errorMessage);
    } finally {
      setSheetSaving(false);
    }
  };

  const openDeleteDialog = (content: Content) => {
    setDeleteContentState(content);
    setDeleteOpen(true);
    setError(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteContentState) return;

    try {
      setDeleteSaving(true);
      setError(null);
      await deleteContent(deleteContentState.id);

      queryClient.setQueryData<Content[]>(["content"], (prev) =>
        prev ? prev.filter((c) => c.id !== deleteContentState.id) : [],
      );

      if (activeContent && activeContent.id === deleteContentState.id) {
        setActiveContent(null);
        setSheetOpen(false);
      }

      setDeleteOpen(false);
      setDeleteContentState(null);
      setDeleteSaving(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete content");
      setDeleteSaving(false);
    }
  };

  // Check if user can edit/delete this content
  const canModifyContent = (content: Content) => {
    if (isSuperuser) return true;
    return content.creator === user?.id;
  };

  const sheetTitleText = isArabic
    ? sheetMode === "view"
      ? "تفاصيل المحتوى"
      : sheetMode === "edit"
        ? "تعديل المحتوى"
        : "إنشاء محتوى"
    : sheetMode === "view"
      ? "Content details"
      : sheetMode === "edit"
        ? "Edit content"
        : "Create content";

  const sheetDescriptionText = isArabic
    ? sheetMode === "view"
      ? "راجع جميع معلومات المحتوى."
      : sheetMode === "edit"
        ? "قم بتحديث معلومات المحتوى ثم احفظ التغييرات."
        : "أنشئ محتوى جديد للدورات."
    : sheetMode === "view"
      ? "Review the full content information."
      : sheetMode === "edit"
        ? "Update the content information and save the changes."
        : "Create new content for courses.";

  const sheetPrimaryButtonText = sheetSaving
    ? isArabic
      ? "جارٍ الحفظ..."
      : "Saving..."
    : sheetMode === "edit"
      ? isArabic
        ? "حفظ التغييرات"
        : "Save changes"
      : isArabic
        ? "حفظ المحتوى"
        : "Save";

  return (
    <div className="px-4 lg:px-6" dir="ltr">
      <div className="mb-6 space-y-1 max-w-6xl mx-auto" dir={isArabic ? "rtl" : "ltr"}>
        <h1 className="text-2xl font-semibold text-[#0b0b2b]">
          {isArabic ? "إدارة المحتوى" : "Content Management"}
        </h1>
        <p className="text-sm text-gray-500">
          {isArabic
            ? "إدارة محتوى الدورات، بما في ذلك الأسماء والأوصاف والأسعار."
            : "Manage course content, including names, descriptions, and pricing."}
        </p>
      </div>

      <Card className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-gray-100 bg-white/95 shadow-[0_10px_40px_rgba(13,13,18,0.05)] transition-shadow duration-200 hover:shadow-[0_18px_55px_rgba(13,13,18,0.07)]">
        <CardHeader
          dir={isArabic ? "rtl" : "ltr"}
          className="flex flex-col gap-4 border-b border-gray-100 bg-linear-to-r from-teal-50/80 via-white to-sky-50/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className={`space-y-1 ${isArabic ? "text-right" : "text-left"}`}>
            <CardTitle className="text-base font-semibold text-[#0b0b2b]">
              {isArabic ? "دليل المحتوى" : "Content directory"}
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              {isArabic
                ? "متصل بواجهة برمجة تطبيقات المحتوى الخاصة بلوحة التحكم مع البحث والإجراءات السريعة."
                : "Connected to your admin content API with search and quick actions."}
            </CardDescription>
          </div>
          <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <div className="inline-flex w-fit items-center justify-center gap-2 self-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-teal-800 shadow-sm ring-1 ring-teal-100/80">
              <span className="mr-1 text-[10px] uppercase tracking-wide text-teal-500">
                {isArabic ? "المحتوى" : "Content"}
              </span>
              <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-700">
                {visibleContentCount}
              </span>
              <span className="mx-1 text-[10px] text-gray-400">{isArabic ? "من" : "of"}</span>
              <span className="text-[11px] text-gray-700">{totalContent}</span>
            </div>
            <div className="w-full sm:w-auto sm:min-w-[220px] flex items-center gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={
                  isArabic
                    ? "ابحث بالاسم أو الوصف"
                    : "Search by name or description"
                }
                className="h-9 w-full rounded-full border border-teal-100 bg-white/90 px-3 text-xs text-gray-800 shadow-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
              />
              <Button
                type="button"
                size="sm"
                disabled={!isUserReady}
                className="rounded-full bg-primary px-5 sm:px-6 text-[11px] font-medium text-white shadow-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleOpenSheet("create")}
              >
                {!isUserReady
                  ? (locale === "ar" ? "جاري التحميل..." : "Loading...")
                  : (locale === "ar" ? "إضافة محتوى جديد" : "Add new content")
                }
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
                          {isArabic ? "الفئة الفرعية" : "Subcategory"}
                        </TableHead>
                        <TableHead className="border-b border-gray-100 px-3 py-3 text-left font-semibold text-[12px]">
                          {isArabic ? "السعر" : "Price"}
                        </TableHead>
                        <TableHead className="border-b border-gray-100 px-3 py-3 text-left font-semibold text-[12px]">
                          {isArabic ? "الحالة" : "Status"}
                        </TableHead>
                        <TableHead className="border-b border-gray-100 px-3 py-3 text-left font-semibold text-[12px] w-20">
                          {isArabic ? "الإجراءات" : "Actions"}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedContent.map((content, index) => (
                        <TableRow
                          key={content.id ?? `content-${index}`}
                          className="border-t border-gray-50 odd:bg-white even:bg-gray-50/40 hover:bg-teal-50/40 transition-colors"
                        >
                          <TableCell className="px-3 py-3 align-middle text-xs text-gray-500">
                            {content.id}
                          </TableCell>
                          <TableCell className="px-3 py-3 align-middle text-xs text-gray-900">
                            <div className="max-w-[200px] truncate font-medium">
                              {content.name}
                            </div>
                          </TableCell>
                          <TableCell className="px-3 py-3 align-middle text-xs text-gray-900">
                            <span className="inline-flex rounded-full bg-gray-50 px-3 py-0.5 text-sm font-base text-gray-700 ring-1 ring-gray-100">
                              {getSubcategoryLabel(content)}
                            </span>
                          </TableCell>
                          <TableCell className="px-3 py-3 align-middle text-xs text-gray-900">
                            ${Number(content.price ?? 0).toFixed(2)}
                          </TableCell>
                          <TableCell className="px-3 py-3 align-middle text-xs">
                            <StatusBadge published={content.is_published} isArabic={isArabic} />
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
                                  onClick={() => handleOpenSheet("view", content)}
                                >
                                  {isArabic ? "عرض التفاصيل" : "View details"}
                                </DropdownMenuItem>
                                {canModifyContent(content) && (
                                  <>
                                    <DropdownMenuItem
                                      className="text-xs"
                                      onClick={() => handleOpenSheet("edit", content)}
                                    >
                                      {isArabic ? "تعديل" : "Edit content"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-xs text-red-600 focus:text-red-600"
                                      onClick={() => openDeleteDialog(content)}
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
                {displayedContent.map((content, index) => (
                  <div
                    key={content.id ?? `mobile-content-${index}`}
                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-px hover:shadow-md"
                  >
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="font-mono text-[11px] text-gray-600">ID {content.id}</span>
                      <StatusBadge published={content.is_published} isArabic={isArabic} />
                    </div>
                    <div className="mt-2 flex flex-col gap-1 text-xs text-gray-700">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-500">{isArabic ? "الاسم" : "Name"}</span>
                        <span className="max-w-[60%] truncate text-right text-gray-800 font-medium">
                          {content.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-500">{isArabic ? "الفئة الفرعية" : "Subcategory"}</span>
                        <span className="max-w-[60%] truncate text-right text-gray-800">
                          {getSubcategoryLabel(content)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-500">{isArabic ? "السعر" : "Price"}</span>
                        <span className="text-right text-gray-800">
                          ${Number(content.price ?? 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full px-3 text-[11px]"
                        onClick={() => handleOpenSheet("view", content)}
                      >
                        {isArabic ? "عرض" : "View"}
                      </Button>
                      {canModifyContent(content) && (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-full px-3 text-[11px]"
                            onClick={() => handleOpenSheet("edit", content)}
                          >
                            {isArabic ? "تعديل" : "Edit"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-full px-3 text-[11px] text-red-600 hover:text-red-700"
                            onClick={() => openDeleteDialog(content)}
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
                {isArabic ? "تحميل المزيد" : "Load more content"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {deleteOpen && deleteContentState && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !deleteSaving) {
              setDeleteOpen(false);
              setDeleteContentState(null);
            }
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">
                {isArabic ? "حذف المحتوى" : "Delete content"}
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                {isArabic
                  ? `هل أنت متأكد من حذف "${deleteContentState.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
                  : `Are you sure you want to delete "${deleteContentState.name}"? This action cannot be undone.`}
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
                  setDeleteContentState(null);
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

          {(activeContent || sheetMode === "create") && (
            <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4">
              {activeContent && sheetMode !== "create" && (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <Label className="text-[11px] text-gray-500">
                      {isArabic ? "المعرف" : "ID"}
                    </Label>
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                      {activeContent.id}
                    </div>
                  </div>
                  {activeContent.creator_name && (
                    <div>
                      <Label className="text-[11px] text-gray-500">
                        {isArabic ? "المنشئ" : "Creator"}
                      </Label>
                      <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                        {activeContent.creator_name}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 text-xs">
                <div>
                  <Label className="text-[11px] text-gray-500">
                    {isArabic ? "الاسم" : "Name"}
                  </Label>
                  {sheetMode === "view" && activeContent ? (
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                      {activeContent.name || "-"}
                    </div>
                  ) : (
                    <Input
                      value={editValues?.name ?? ""}
                      onChange={(e) => handleEditFieldChange("name", e.target.value)}
                      className="mt-1 h-8 text-[13px]"
                      placeholder={isArabic ? "أدخل اسم المحتوى" : "Enter content name"}
                    />
                  )}
                </div>
                <div>
                  <Label className="text-[11px] text-gray-500">
                    {isArabic ? "الوصف" : "Description"}
                  </Label>
                  {sheetMode === "view" && activeContent ? (
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800 whitespace-pre-wrap">
                      {activeContent.description || "-"}
                    </div>
                  ) : (
                    <Textarea
                      value={editValues?.description ?? ""}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleEditFieldChange("description", e.target.value)}
                      className="mt-1 text-[13px] min-h-20"
                      placeholder={isArabic ? "أدخل وصف المحتوى" : "Enter content description"}
                    />
                  )}
                </div>
                <div>
                  <Label className="text-[11px] text-gray-500">
                    {isArabic ? "الفئة الفرعية" : "Subcategory"}
                  </Label>
                  {sheetMode === "view" && activeContent ? (
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                      {getSubcategoryLabel(activeContent)}
                    </div>
                  ) : (
                    <select
                      value={selectedSubcategoryId ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedSubcategoryId(value ? Number(value) : null);
                      }}
                      className="mt-1 h-8 w-full rounded-md border border-gray-200 bg-white px-2 text-[13px] text-gray-800 shadow-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                      disabled={subcategoriesLoading || subcategories.length === 0}
                    >
                      <option value="">
                        {subcategoriesLoading
                          ? isArabic
                            ? "جاري تحميل الفئات الفرعية..."
                            : "Loading subcategories..."
                          : isArabic
                            ? "اختر الفئة الفرعية"
                            : "Select subcategory"}
                      </option>
                      {subcategories.map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {isArabic
                            ? subcategory.title_arabic || subcategory.title_english
                            : subcategory.title_english || subcategory.title_arabic}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <Label className="text-[11px] text-gray-500">
                    {isArabic ? "السعر" : "Price"}
                  </Label>
                  {sheetMode === "view" && activeContent ? (
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                      ${Number(activeContent.price ?? 0).toFixed(2)}
                    </div>
                  ) : (
                    <>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-500">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          inputMode="decimal"
                          value={editValues?.price ?? 0}
                          onChange={(e) => handleEditFieldChange("price", parseFloat(e.target.value) || 0)}
                          className="mt-0 h-8 text-[13px] pl-7 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-auto [&::-webkit-outer-spin-button]:appearance-auto"
                          placeholder="0.00"
                        />
                      </div>
                      <p className="mt-1.5 text-[11px] text-gray-500">
                        {isArabic
                          ? "يتم تقريب السعر تلقائياً إلى رقمين عشريين (مثال: 99.99)"
                          : "Price will be automatically rounded to 2 decimal places (e.g., 99.99)"}
                      </p>
                    </>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] text-gray-500">
                    {isArabic ? "منشور" : "Published"}
                  </Label>
                  {sheetMode === "view" && activeContent ? (
                    <StatusBadge published={activeContent.is_published} isArabic={isArabic} />
                  ) : (
                    <Switch
                      checked={editValues?.is_published ?? false}
                      onCheckedChange={(checked: boolean) => handleEditFieldChange("is_published", checked)}
                    />
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
                onClick={handleSaveContent}
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
