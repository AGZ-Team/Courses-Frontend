"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { IconDotsVertical } from "@tabler/icons-react";

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
import type { Category } from "@/types/category";
import type { Subcategory } from "@/types/subcategory";
import { fetchCategories } from "@/services/categoriesService";
import { fetchSubcategories, createSubcategory, updateSubcategory, deleteSubcategory } from "@/services/subcategoriesService";

function CategoryBadge({ value }: { value: string }) {
  return (
    <span className="inline-flex rounded-full bg-gray-50 px-3 py-0.5 text-sm md:text-[14px] font-base text-gray-700 ring-1 ring-gray-100">
      {value || "-"}
    </span>
  );
}

export default function SubcategoriesPanel() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"view" | "edit" | "create">("view");
  const [activeSubcategory, setActiveSubcategory] = useState<Subcategory | null>(null);
  const [editValues, setEditValues] = useState<Partial<Subcategory> | null>(null);
  const [sheetSaving, setSheetSaving] = useState(false);
  const [sheetError, setSheetError] = useState<string | null>(null);

  const [visibleCount, setVisibleCount] = useState(20);
  const [deleteSubcategoryState, setDeleteSubcategoryState] = useState<Subcategory | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const {
    data: subcategories = [],
    isLoading: loading,
    error: queryError,
  } = useQuery<Subcategory[]>({
    queryKey: ["subcategories"],
    queryFn: fetchSubcategories,
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

  const filteredSubcategories = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return subcategories;

    return subcategories.filter((subcategory) => {
      return (
        subcategory.title_arabic.toLowerCase().includes(q) ||
        subcategory.title_english.toLowerCase().includes(q)
      );
    });
  }, [subcategories, search]);

  const displayedSubcategories = useMemo(
    () => filteredSubcategories.slice(0, visibleCount),
    [filteredSubcategories, visibleCount],
  );

  const totalSubcategories = subcategories.length;
  const visibleSubcategories = displayedSubcategories.length;
  const hasMore = filteredSubcategories.length > visibleSubcategories;

  const getCategoryLabel = (subcategory: Subcategory) => {
    const match = categories.find((category) => category.id === subcategory.category);
    if (!match) return "-";
    return isArabic ? match.title_arabic || "-" : match.title_english || "-";
  };

  const handleOpenSheet = (mode: "view" | "edit" | "create", subcategory?: Subcategory) => {
    setSheetMode(mode);
    setSheetError(null);

    if (mode === "create") {
      setActiveSubcategory(null);
      setEditValues({ title_arabic: "", title_english: "" });
      setSelectedCategoryId(categories.length > 0 ? categories[0].id : null);
    } else if (subcategory) {
      setActiveSubcategory(subcategory);
      const existingCategoryId = typeof subcategory.category === "number" ? subcategory.category : null;
      setSelectedCategoryId(existingCategoryId ?? (categories.length > 0 ? categories[0].id : null));
      if (mode === "edit") {
        setEditValues({ ...subcategory });
      } else {
        setEditValues(null);
      }
    }

    setSheetOpen(true);
  };

  const handleEditFieldChange = (field: keyof Subcategory, value: string | number) => {
    setEditValues((prev) => ({ ...(prev ?? {}), [field]: value }));
  };

  const handleSaveSubcategory = async () => {
    if (!editValues) return;

    try {
      setSheetError(null);

      if (!selectedCategoryId) {
        setSheetError(
          isArabic
            ? "يرجى اختيار فئة رئيسية قبل الحفظ."
            : "Please select a parent category before saving.",
        );
        return;
      }

      setSheetSaving(true);

      if (sheetMode === "create") {
        const payload: Partial<Subcategory> = {
          title_arabic: editValues.title_arabic?.trim() ?? "",
          title_english: editValues.title_english?.trim() ?? "",
          category: selectedCategoryId,
        };

        const created = await createSubcategory(payload);
        queryClient.setQueryData<Subcategory[]>(["subcategories"], (prev) =>
          prev ? [...prev, created] : [created],
        );
        setActiveSubcategory(created);
      } else if (sheetMode === "edit" && activeSubcategory) {
        const payload: Partial<Subcategory> = {
          title_arabic: (editValues.title_arabic ?? activeSubcategory.title_arabic).trim(),
          title_english: (editValues.title_english ?? activeSubcategory.title_english).trim(),
          category: selectedCategoryId,
        };

        const updated = await updateSubcategory(activeSubcategory.id, payload);
        queryClient.setQueryData<Subcategory[]>(["subcategories"], (prev) =>
          prev ? prev.map((c) => (c.id === updated.id ? updated : c)) : [updated],
        );
        setActiveSubcategory(updated);
      }

      setSheetOpen(false);
    } catch (err) {
      setSheetError(err instanceof Error ? err.message : "Failed to save subcategory");
    } finally {
      setSheetSaving(false);
    }
  };

  const openDeleteDialog = (subcategory: Subcategory) => {
    setDeleteSubcategoryState(subcategory);
    setDeleteOpen(true);
    setError(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteSubcategoryState) return;

    try {
      setDeleteSaving(true);
      setError(null);
      await deleteSubcategory(deleteSubcategoryState.id);

      queryClient.setQueryData<Subcategory[]>(["subcategories"], (prev) =>
        prev ? prev.filter((c) => c.id !== deleteSubcategoryState.id) : [],
      );

      if (activeSubcategory && activeSubcategory.id === deleteSubcategoryState.id) {
        setActiveSubcategory(null);
        setSheetOpen(false);
      }

      setDeleteOpen(false);
      setDeleteSubcategoryState(null);
      setDeleteSaving(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete subcategory");
      setDeleteSaving(false);
    }
  };

  const sheetTitleText = isArabic
    ? sheetMode === "view"
      ? "تفاصيل الفئة الفرعية"
      : sheetMode === "edit"
      ? "تعديل الفئة الفرعية"
      : "إنشاء فئة فرعية"
    : sheetMode === "view"
    ? "Subcategory details"
    : sheetMode === "edit"
    ? "Edit subcategory"
    : "Create subcategory";

  const sheetDescriptionText = isArabic
    ? sheetMode === "view"
      ? "راجع جميع معلومات الفئة الفرعية."
      : sheetMode === "edit"
      ? "قم بتحديث معلومات الفئة الفرعية ثم احفظ التغييرات."
      : "أنشئ فئة فرعية جديدة لتنظيم الدورات بشكل أدق."
    : sheetMode === "view"
    ? "Review the full subcategory information."
    : sheetMode === "edit"
    ? "Update the subcategory information and save the changes."
    : "Create a new subcategory for more granular organization.";

  const sheetPrimaryButtonText = sheetSaving
    ? isArabic
      ? "جارٍ الحفظ..."
      : "Saving..."
    : sheetMode === "edit"
    ? isArabic
      ? "حفظ التغييرات"
      : "Save changes"
    : isArabic
    ? "حفظ الفئة الفرعية"
    : "Save";

  return (
    <div className="px-4 lg:px-6" dir="ltr">
      <div className="mb-6 space-y-1 max-w-6xl mx-auto" dir={isArabic ? "rtl" : "ltr"}>
        <h1 className="text-2xl font-semibold text-[#0b0b2b]">
          {isArabic ? "الفئات الفرعية" : "Subcategories"}
        </h1>
        <p className="text-sm text-gray-500">
          {isArabic
            ? "إدارة الفئات الفرعية للدورات، بما في ذلك العناوين العربية والإنجليزية."
            : "Manage course subcategories, including Arabic and English titles."}
        </p>
      </div>

      <Card className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-gray-100 bg-white/95 shadow-[0_10px_40px_rgba(13,13,18,0.05)] transition-shadow duration-200 hover:shadow-[0_18px_55px_rgba(13,13,18,0.07)]">
        <CardHeader
          dir={isArabic ? "rtl" : "ltr"}
          className="flex flex-col gap-4 border-b border-gray-100 bg-gradient-to-r from-teal-50/80 via-white to-sky-50/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className={`space-y-1 ${isArabic ? "text-right" : "text-left"}`}>
            <CardTitle className="text-base font-semibold text-[#0b0b2b]">
              {isArabic ? "دليل الفئات الفرعية" : "Subcategory directory"}
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              {isArabic
                ? "متصل بواجهة برمجة تطبيقات الفئات الفرعية الخاصة بلوحة التحكم مع البحث والإجراءات السريعة."
                : "Connected to your admin subcategories API with search and quick actions."}
            </CardDescription>
          </div>
          <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <div className="inline-flex w-fit items-center justify-center gap-2 self-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-teal-800 shadow-sm ring-1 ring-teal-100/80">
              <span className="mr-1 text-[10px] uppercase tracking-wide text-teal-500">
                {isArabic ? "الفئات الفرعية" : "Subcategories"}
              </span>
              <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-700">
                {visibleSubcategories}
              </span>
              <span className="mx-1 text-[10px] text-gray-400">{isArabic ? "من" : "of"}</span>
              <span className="text-[11px] text-gray-700">{totalSubcategories}</span>
            </div>
            <div className="w-full sm:w-auto sm:min-w-[220px] flex items-center gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={
                  isArabic
                    ? "ابحث بالعنوان العربي أو الإنجليزي"
                    : "Search by Arabic or English title"
                }
                className="h-9 w-full rounded-full border border-teal-100 bg-white/90 px-3 text-xs text-gray-800 shadow-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
              />
              <Button
                type="button"
                size="sm"
                className="rounded-full bg-primary px-5 sm:px-6 text-[11px] font-medium text-white shadow-sm hover:bg-primary/90"
                onClick={() => handleOpenSheet("create")}
              >
                {locale === "ar" ? "إضافة فئة فرعية جديدة" : "Add new subcategory"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-[320px] items-center justify-center">
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
                          Arabic title
                        </TableHead>
                        <TableHead className="border-b border-gray-100 px-3 py-3 text-left font-semibold text-[12px]">
                          English title
                        </TableHead>
                        <TableHead className="border-b border-gray-100 px-3 py-3 text-left font-semibold text-[12px]">
                          {isArabic ? "الفئة" : "Category"}
                        </TableHead>
                        <TableHead className="border-b border-gray-100 px-3 py-3 text-left font-semibold text-[12px] w-20">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedSubcategories.map((subcategory) => (
                        <TableRow
                          key={subcategory.id}
                          className="border-t border-gray-50 odd:bg-white even:bg-gray-50/40 hover:bg-teal-50/40 transition-colors"
                        >
                          <TableCell className="px-3 py-3 align-middle text-xs text-gray-500">
                            {subcategory.id}
                          </TableCell>
                          <TableCell className="px-3 py-3 align-middle text-xs text-gray-900">
                            <CategoryBadge value={subcategory.title_arabic} />
                          </TableCell>
                          <TableCell className="px-3 py-3 align-middle text-xs text-gray-900">
                            <CategoryBadge value={subcategory.title_english} />
                          </TableCell>
                          <TableCell className="px-3 py-3 align-middle text-xs text-gray-900">
                            <CategoryBadge value={getCategoryLabel(subcategory)} />
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
                                  onClick={() => handleOpenSheet("view", subcategory)}
                                >
                                  View details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-xs"
                                  onClick={() => handleOpenSheet("edit", subcategory)}
                                >
                                  Edit subcategory
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-xs text-red-600 focus:text-red-600"
                                  onClick={() => openDeleteDialog(subcategory)}
                                >
                                  Delete
                                </DropdownMenuItem>
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
                {displayedSubcategories.map((subcategory) => (
                  <div
                    key={subcategory.id}
                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-[1px] hover:shadow-md"
                  >
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="font-mono text-[11px] text-gray-600">ID {subcategory.id}</span>
                    </div>
                    <div className="mt-2 flex flex-col gap-1 text-xs text-gray-700">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-500">Arabic</span>
                        <span className="max-w-[60%] truncate text-right text-gray-800">
                          {subcategory.title_arabic}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-500">English</span>
                        <span className="max-w-[60%] truncate text-right text-gray-800">
                          {subcategory.title_english}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-500">{isArabic ? "الفئة" : "Category"}</span>
                        <span className="max-w-[60%] truncate text-right text-gray-800">
                          {getCategoryLabel(subcategory)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full px-3 text-[11px]"
                        onClick={() => handleOpenSheet("view", subcategory)}
                      >
                        View
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full px-3 text-[11px]"
                        onClick={() => handleOpenSheet("edit", subcategory)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full px-3 text-[11px] text-red-600 hover:text-red-700"
                        onClick={() => openDeleteDialog(subcategory)}
                      >
                        Delete
                      </Button>
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
                Load more subcategories
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {deleteOpen && deleteSubcategoryState && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !deleteSaving) {
              setDeleteOpen(false);
              setDeleteSubcategoryState(null);
            }
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">Delete subcategory</h2>
              <p className="mt-1 text-xs text-gray-500">
                Are you sure you want to delete &ldquo;{deleteSubcategoryState.title_english || deleteSubcategoryState.title_arabic}&rdquo;?
                This action cannot be undone.
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
                    <span>Deleting...</span>
                  </span>
                ) : (
                  "Delete"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                disabled={deleteSaving}
                onClick={() => {
                  setDeleteOpen(false);
                  setDeleteSubcategoryState(null);
                  setError(null);
                }}
              >
                Cancel
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

          {(activeSubcategory || sheetMode === "create") && (
            <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4">
              {activeSubcategory && sheetMode !== "create" && (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <Label className="text-[11px] text-gray-500">
                      {isArabic ? "المعرف" : "ID"}
                    </Label>
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                      {activeSubcategory.id}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 text-xs">
                <div>
                  <Label className="text-[11px] text-gray-500">
                    {isArabic ? "العنوان بالعربية" : "Arabic title"}
                  </Label>
                  {sheetMode === "view" && activeSubcategory ? (
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                      {activeSubcategory.title_arabic || "-"}
                    </div>
                  ) : (
                    <Input
                      value={editValues?.title_arabic ?? ""}
                      onChange={(e) => handleEditFieldChange("title_arabic", e.target.value)}
                      className="mt-1 h-8 text-[13px]"
                    />
                  )}
                </div>
                <div>
                  <Label className="text-[11px] text-gray-500">
                    {isArabic ? "العنوان بالإنجليزية" : "English title"}
                  </Label>
                  {sheetMode === "view" && activeSubcategory ? (
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                      {activeSubcategory.title_english || "-"}
                    </div>
                  ) : (
                    <Input
                      value={editValues?.title_english ?? ""}
                      onChange={(e) => handleEditFieldChange("title_english", e.target.value)}
                      className="mt-1 h-8 text-[13px]"
                    />
                  )}
                </div>
                <div>
                  <Label className="text-[11px] text-gray-500">
                    {isArabic ? "الفئة الرئيسية" : "Parent category"}
                  </Label>
                  {sheetMode === "view" && activeSubcategory ? (
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                      {getCategoryLabel(activeSubcategory)}
                    </div>
                  ) : (
                    <select
                      value={selectedCategoryId ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedCategoryId(value ? Number(value) : null);
                      }}
                      className="mt-1 h-8 w-full rounded-md border border-gray-200 bg-white px-2 text-[13px] text-gray-800 shadow-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                      disabled={categoriesLoading || categories.length === 0}
                    >
                      <option value="">
                        {categoriesLoading
                          ? isArabic
                            ? "جاري تحميل الفئات..."
                            : "Loading categories..."
                          : isArabic
                          ? "اختر الفئة"
                          : "Select category"}
                      </option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {isArabic
                            ? category.title_arabic || category.title_english
                            : category.title_english || category.title_arabic}
                        </option>
                      ))}
                    </select>
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
                onClick={handleSaveSubcategory}
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
