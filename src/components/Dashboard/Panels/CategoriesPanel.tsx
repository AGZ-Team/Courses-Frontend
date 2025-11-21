"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "@/services/categoriesService";

function CategoryBadge({ value }: { value: string }) {
  return (
    <span className="inline-flex rounded-full bg-gray-50 px-3 py-0.5 text-sm md:text-[14px] font-base text-gray-700 ring-1 ring-gray-100">
      {value || "-"}
    </span>
  );
}

export default function CategoriesPanel() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"view" | "edit" | "create">("view");
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [editValues, setEditValues] = useState<Partial<Category> | null>(null);
  const [sheetSaving, setSheetSaving] = useState(false);
  const [sheetError, setSheetError] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [visibleCount, setVisibleCount] = useState(20);
  const [deleteCategoryState, setDeleteCategoryState] = useState<Category | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteSaving, setDeleteSaving] = useState(false);

  const queryClient = useQueryClient();
  const {
    data: categories = [],
    isLoading: loading,
    error: queryError,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
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

  const filteredCategories = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return categories;

    return categories.filter((category) => {
      return (
        category.title_arabic.toLowerCase().includes(q) ||
        category.title_english.toLowerCase().includes(q)
      );
    });
  }, [categories, search]);

  const displayedCategories = useMemo(
    () => filteredCategories.slice(0, visibleCount),
    [filteredCategories, visibleCount],
  );

  const totalCategories = categories.length;
  const visibleCategories = displayedCategories.length;
  const hasMore = filteredCategories.length > visibleCategories;

  const handleOpenSheet = (mode: "view" | "edit" | "create", category?: Category) => {
    setSheetMode(mode);
    setSheetError(null);
    setImageFile(null);

    if (mode === "create") {
      setActiveCategory(null);
      setEditValues({ title_arabic: "", title_english: "", image: "" });
    } else if (category) {
      setActiveCategory(category);
      if (mode === "edit") {
        setEditValues({ ...category });
      } else {
        setEditValues(null);
      }
    }

    setSheetOpen(true);
  };

  const handleEditFieldChange = (field: keyof Category, value: any) => {
    setEditValues((prev) => ({ ...(prev ?? {}), [field]: value }));
  };

  const handleSaveCategory = async () => {
    if (!editValues) return;

    try {
      setSheetSaving(true);
      setSheetError(null);

      if (sheetMode === "create") {
        const payload: Partial<Category> = {
          title_arabic: editValues.title_arabic?.trim() ?? "",
          title_english: editValues.title_english?.trim() ?? "",
          image: editValues.image ?? null,
        };

        const created = await createCategory({ ...payload, imageFile });
        queryClient.setQueryData<Category[]>(["categories"], (prev) =>
          prev ? [...prev, created] : [created],
        );
        setActiveCategory(created);
      } else if (sheetMode === "edit" && activeCategory) {
        const payload: Partial<Category> = {
          title_arabic: (editValues.title_arabic ?? activeCategory.title_arabic).trim(),
          title_english: (editValues.title_english ?? activeCategory.title_english).trim(),
        };

        const updated = await updateCategory(activeCategory.id, { ...payload, imageFile });
        queryClient.setQueryData<Category[]>(["categories"], (prev) =>
          prev ? prev.map((c) => (c.id === updated.id ? updated : c)) : [updated],
        );
        setActiveCategory(updated);
      }

      setImageFile(null);
      setSheetOpen(false);
    } catch (err) {
      setSheetError(err instanceof Error ? err.message : "Failed to save category");
    } finally {
      setSheetSaving(false);
    }
  };

  const openDeleteDialog = (category: Category) => {
    setDeleteCategoryState(category);
    setDeleteOpen(true);
    setError(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteCategoryState) return;

    try {
      setDeleteSaving(true);
      setError(null);
      await deleteCategory(deleteCategoryState.id);

      queryClient.setQueryData<Category[]>(["categories"], (prev) =>
        prev ? prev.filter((c) => c.id !== deleteCategoryState.id) : [],
      );

      if (activeCategory && activeCategory.id === deleteCategoryState.id) {
        setActiveCategory(null);
        setSheetOpen(false);
      }

      setDeleteOpen(false);
      setDeleteCategoryState(null);
      setDeleteSaving(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category");
      setDeleteSaving(false);
    }
  };

  return (
    <div className="px-4 lg:px-6" dir="ltr">
      <div className="mb-6 space-y-1 max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-[#0b0b2b]">Categories</h1>
        <p className="text-sm text-gray-500">
          Manage course categories, including Arabic and English titles and images.
        </p>
      </div>

      <Card className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-gray-100 bg-white/95 shadow-[0_10px_40px_rgba(13,13,18,0.05)] transition-shadow duration-200 hover:shadow-[0_18px_55px_rgba(13,13,18,0.07)]">
        <CardHeader className="flex flex-col gap-4 border-b border-gray-100 bg-gradient-to-r from-teal-50/80 via-white to-sky-50/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 text-left">
            <CardTitle className="text-base font-semibold text-[#0b0b2b]">
              Category directory
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Connected to your admin categories API with search and quick actions.
            </CardDescription>
          </div>
          <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <div className="inline-flex w-fit items-center justify-center gap-2 self-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-teal-800 shadow-sm ring-1 ring-teal-100/80">
              <span className="mr-1 text-[10px] uppercase tracking-wide text-teal-500">Categories</span>
              <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-700">
                {visibleCategories}
              </span>
              <span className="mx-1 text-[10px] text-gray-400">of</span>
              <span className="text-[11px] text-gray-700">{totalCategories}</span>
            </div>
            <div className="w-full sm:w-auto sm:min-w-[220px] flex items-center gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by Arabic or English title"
                className="h-9 w-full rounded-full border border-teal-100 bg-white/90 px-3 text-xs text-gray-800 shadow-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
              />
              <Button
                type="button"
                size="sm"
                className="rounded-full bg-primary px-4 text-[11px] font-medium text-white shadow-sm hover:bg-primary/90"
                onClick={() => handleOpenSheet("create")}
              >
                New category
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
                          Image
                        </TableHead>
                        <TableHead className="border-b border-gray-100 px-3 py-3 text-left font-semibold text-[12px] w-20">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedCategories.map((category) => (
                        <TableRow
                          key={category.id}
                          className="border-t border-gray-50 odd:bg-white even:bg-gray-50/40 hover:bg-teal-50/40 transition-colors"
                        >
                          <TableCell className="px-3 py-3 align-middle text-xs text-gray-500">
                            {category.id}
                          </TableCell>
                          <TableCell className="px-3 py-3 align-middle text-xs text-gray-900">
                            <CategoryBadge value={category.title_arabic} />
                          </TableCell>
                          <TableCell className="px-3 py-3 align-middle text-xs text-gray-900">
                            <CategoryBadge value={category.title_english} />
                          </TableCell>
                          <TableCell className="px-3 py-3 align-middle text-xs text-gray-600">
                            {category.image ? (
                              <div className="flex items-center gap-2">
                                <img
                                  src={category.image}
                                  alt={category.title_english || category.title_arabic || "Category image"}
                                  className="h-10 w-10 md:h-12 md:w-12 rounded object-cover border border-gray-200 bg-gray-50"
                                />
                              </div>
                            ) : (
                              "-"
                            )}
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
                                  onClick={() => handleOpenSheet("view", category)}
                                >
                                  View details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-xs"
                                  onClick={() => handleOpenSheet("edit", category)}
                                >
                                  Edit category
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-xs text-red-600 focus:text-red-600"
                                  onClick={() => openDeleteDialog(category)}
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
                {displayedCategories.map((category) => (
                  <div
                    key={category.id}
                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-[1px] hover:shadow-md"
                  >
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="font-mono text-[11px] text-gray-600">ID {category.id}</span>
                    </div>
                    <div className="mt-2 flex flex-col gap-1 text-xs text-gray-700">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-500">Arabic</span>
                        <span className="max-w-[60%] truncate text-right text-gray-800">
                          {category.title_arabic}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-500">English</span>
                        <span className="max-w-[60%] truncate text-right text-gray-800">
                          {category.title_english}
                        </span>
                      </div>
                      {category.image && (
                        <div className="flex items-start justify-between gap-2">
                          <span className="mt-0.5 text-gray-500">Image</span>
                          <div className="flex items-center justify-end max-w-[60%]">
                            <img
                              src={category.image}
                              alt={category.title_english || category.title_arabic || "Category image"}
                              className="h-12 w-12 rounded object-cover border border-gray-200 bg-gray-50"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full px-3 text-[11px]"
                        onClick={() => handleOpenSheet("view", category)}
                      >
                        View
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full px-3 text-[11px]"
                        onClick={() => handleOpenSheet("edit", category)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full px-3 text-[11px] text-red-600 hover:text-red-700"
                        onClick={() => openDeleteDialog(category)}
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
                Load more categories
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {deleteOpen && deleteCategoryState && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !deleteSaving) {
              setDeleteOpen(false);
              setDeleteCategoryState(null);
            }
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">Delete category</h2>
              <p className="mt-1 text-xs text-gray-500">
                Are you sure you want to delete "{deleteCategoryState.title_english || deleteCategoryState.title_arabic}"?
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
                  setDeleteCategoryState(null);
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
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {sheetMode === "view"
                ? "Category details"
                : sheetMode === "edit"
                ? "Edit category"
                : "Create category"}
            </SheetTitle>
            <SheetDescription>
              {sheetMode === "view"
                ? "Review the full category information."
                : sheetMode === "edit"
                ? "Update the category information and save the changes."
                : "Create a new category for organizing courses."}
            </SheetDescription>
          </SheetHeader>

          {sheetError && (
            <div className="mx-4 mb-2 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
              {sheetError}
            </div>
          )}

          {(activeCategory || sheetMode === "create") && (
            <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4">
              {activeCategory && sheetMode !== "create" && (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <Label className="text-[11px] text-gray-500">ID</Label>
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                      {activeCategory.id}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 text-xs">
                <div>
                  <Label className="text-[11px] text-gray-500">Arabic title</Label>
                  {sheetMode === "view" && activeCategory ? (
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                      {activeCategory.title_arabic || "-"}
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
                  <Label className="text-[11px] text-gray-500">English title</Label>
                  {sheetMode === "view" && activeCategory ? (
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                      {activeCategory.title_english || "-"}
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
                  <Label className="text-[11px] text-gray-500">Image</Label>
                  {sheetMode === "view" && activeCategory ? (
                    <div className="mt-1 space-y-3">
                      <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-[12px] text-gray-700 break-all">
                        {activeCategory.image || "-"}
                      </div>
                      {activeCategory.image && (
                        <div className="flex items-center justify-center">
                          <div className="max-h-64 w-full max-w-sm overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                            <img
                              src={activeCategory.image}
                              alt={activeCategory.title_english || activeCategory.title_arabic || "Category image"}
                              className="h-full w-full object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-1 space-y-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="group flex w-full items-center justify-between rounded-xl border border-dashed border-gray-200 bg-gray-50/80 px-3 py-2 text-[11px] text-gray-600 transition-all hover:border-teal-300 hover:bg-teal-50/80 hover:text-teal-700"
                      >
                        <div className="flex flex-col text-left">
                          <span className="font-medium text-[11px]">Click to upload</span>
                          <span className="text-[10px] text-gray-400 group-hover:text-teal-500">
                            PNG or JPG up to 5MB
                          </span>
                        </div>
                        <span className="ml-3 max-w-[120px] truncate text-[10px] text-gray-500 group-hover:text-teal-600">
                          {imageFile?.name || "No file chosen"}
                        </span>
                      </button>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          setImageFile(file);
                        }}
                        className="hidden"
                      />
                      {activeCategory?.image && (
                        <div className="space-y-3">
                          <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-[11px] text-gray-600 break-all">
                            Current image URL: {activeCategory.image}
                          </div>
                          <div className="flex items-center justify-center">
                            <div className="max-h-56 w-full max-w-sm overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                              <img
                                src={activeCategory.image}
                                alt={activeCategory.title_english || activeCategory.title_arabic || "Category image"}
                                className="h-full w-full object-contain"
                              />
                            </div>
                          </div>
                        </div>
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
                Close
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSaveCategory}
                disabled={sheetSaving}
                className="w-full rounded-full bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
              >
                {sheetSaving ? "Saving..." : "Save"}
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
