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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { AdminUser } from "@/types/adminUser";
import { fetchAdminUsers, updateAdminUser, updateAdminUserWithFiles, deleteAdminUser } from "@/services/adminUsersService";

function BooleanBadge({
  value,
  yesLabel = "Yes",
  noLabel = "No",
}: {
  value: boolean;
  yesLabel?: string;
  noLabel?: string;
}) {
  return (
    <span
      className={
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium " +
        (value
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
          : "bg-gray-50 text-gray-600 ring-1 ring-gray-100")
      }
    >
      {value ? yesLabel : noLabel}
    </span>
  );
}

export default function UsersPanel() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"view" | "edit">("view");
  const [activeUser, setActiveUser] = useState<AdminUser | null>(null);
  const [editValues, setEditValues] = useState<Partial<AdminUser> | null>(null);
  const [sheetSaving, setSheetSaving] = useState(false);
  const [sheetError, setSheetError] = useState<string | null>(null);
  const [inlineSavingId, setInlineSavingId] = useState<number | null>(null);
  const [roleFilter, setRoleFilter] = useState<"all" | "influencer" | "normal">("all");
  const [visibleCount, setVisibleCount] = useState(20);
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [idCardFaceFile, setIdCardFaceFile] = useState<File | null>(null);
  const [idCardBackFile, setIdCardBackFile] = useState<File | null>(null);

  // Format long URLs to a compact representation for table cells.
  // Shows only the filename to save space
  const formatShortUrl = (url?: string | null) => {
    if (!url) return "";
    try {
      // Extract just the filename from the URL
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      // Truncate filename if too long
      if (filename.length > 20) {
        return filename.slice(0, 17) + '...';
      }
      return filename;
    } catch (e) {
      // If it's not parseable, fallback to a simple truncation
      return url.length > 20 ? url.slice(0, 17) + '...' : url;
    }
  };

  const queryClient = useQueryClient();
  const {
    data: rows = [],
    isLoading: loading,
    error: queryError,
  } = useQuery<AdminUser[]>({
    queryKey: ["adminUsers"],
    queryFn: () => fetchAdminUsers(),
  });

  useEffect(() => {
    if (queryError instanceof Error) {
      setError(queryError.message);
    }
  }, [queryError]);

  useEffect(() => {
    setVisibleCount(20);
  }, [search, roleFilter]);

  // Debounce search input to avoid excessive filtering / future server calls
  useEffect(() => {
    const handle = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 300);

    return () => {
      clearTimeout(handle);
    };
  }, [searchInput]);

  const handleOpenSheet = (mode: "view" | "edit", user: AdminUser) => {
    setSheetMode(mode);
    setActiveUser(user);
    setSheetError(null);
    setSheetOpen(true);
    if (mode === "edit") {
      setEditValues({ ...user });
      setPictureFile(null);
      setIdCardFaceFile(null);
      setIdCardBackFile(null);
    } else {
      setEditValues(null);
    }
  };

  const handleEditFieldChange = (field: keyof AdminUser, value: string | boolean) => {
    setEditValues((prev) => ({ ...(prev ?? {}), [field]: value }));
  };

  const handleSaveUser = async () => {
    if (!activeUser || !editValues) return;

    try {
      setSheetSaving(true);
      setSheetError(null);

      // Check if any files are being uploaded
      const hasFiles = pictureFile || idCardFaceFile || idCardBackFile;

      if (hasFiles) {
        // Validate file sizes (max 10MB per file - backend limit)
        const maxFileSize = 10 * 1024 * 1024; // 10MB
        const files = [
          { file: pictureFile, name: "picture" },
          { file: idCardFaceFile, name: "id_card_face" },
          { file: idCardBackFile, name: "id_card_back" },
        ];

        for (const { file, name } of files) {
          if (file && file.size > maxFileSize) {
            setSheetError(`${name} must be less than 10MB`);
            setSheetSaving(false);
            return;
          }
        }

        // Upload each file separately (one at a time)
        // Skip text updates when there are files - let each file request handle all fields
        let updated = activeUser;

        for (const { file, name } of files) {
          if (file) {
            const formData = new FormData();
            // Append all edited fields to the FormData along with the file
            Object.keys(editValues).forEach((key) => {
              const value = editValues[key as keyof AdminUser];
              if (value !== undefined && value !== null && key !== 'picture' && key !== 'id_card_face' && key !== 'id_card_back') {
                formData.append(key, String(value));
              }
            });
            // Append the file
            formData.append(name as string, file);
            
            try {
              updated = await updateAdminUserWithFiles(activeUser.id, formData);
              console.log(`✓ ${name} uploaded successfully`);
            } catch (error) {
              console.error(`Failed to upload ${name}:`, error);
              throw error;
            }
          }
        }

        queryClient.setQueryData<AdminUser[]>(["adminUsers"], (prev) =>
          prev ? prev.map((u) => (u.id === updated.id ? updated : u)) : [updated],
        );
        setActiveUser(updated);
        setPictureFile(null);
        setIdCardFaceFile(null);
        setIdCardBackFile(null);
      } else {
  // No files, just update text fields
  // Remove file fields from the payload to avoid sending URLs as "files"
  const { picture: _picture, id_card_face: _id_card_face, id_card_back: _id_card_back, ...textFields } = editValues;
  const payload: Partial<AdminUser> = { ...textFields };
        const updated = await updateAdminUser(activeUser.id, payload);
        queryClient.setQueryData<AdminUser[]>(["adminUsers"], (prev) =>
          prev ? prev.map((u) => (u.id === updated.id ? updated : u)) : [updated],
        );
        setActiveUser(updated);
      }

      setSheetOpen(false);
    } catch (err) {
      setSheetError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setSheetSaving(false);
    }
  };

  const handleToggleVerified = async (user: AdminUser, value: boolean) => {
    try {
      setInlineSavingId(user.id);
      setError(null);
      const updated = await updateAdminUser(user.id, { ...user, is_verified: value });
      queryClient.setQueryData<AdminUser[]>(["adminUsers"], (prev) =>
        prev ? prev.map((u) => (u.id === updated.id ? updated : u)) : [updated],
      );
      setActiveUser((prev) => (prev && prev.id === updated.id ? updated : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setInlineSavingId(null);
    }
  };

  const openDeleteDialog = (user: AdminUser) => {
    setDeleteUser(user);
    setDeleteOpen(true);
    setError(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteUser) return;

    try {
      setDeleteSaving(true);
      setError(null);
      await deleteAdminUser(deleteUser.id);

      // Update the rows list to remove the deleted user
      queryClient.setQueryData<AdminUser[]>(["adminUsers"], (prev) =>
        prev ? prev.filter((u) => u.id !== deleteUser.id) : [],
      );

      // Close the sheet if the deleted user was being viewed/edited
      if (activeUser && activeUser.id === deleteUser.id) {
        setActiveUser(null);
        setSheetOpen(false);
      }
      
      // Close the delete modal and reset state
      setDeleteOpen(false);
      setDeleteUser(null);
      setDeleteSaving(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
      setDeleteSaving(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();

    return rows.filter((user) => {
      if (roleFilter === "influencer" && !user.is_influencer) return false;
      if (roleFilter === "normal" && user.is_influencer) return false;

      if (!q) return true;

      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      return (
        fullName.includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.username.toLowerCase().includes(q) ||
        user.phone.toLowerCase().includes(q)
      );
    });
  }, [search, rows, roleFilter]);

  const displayedUsers = useMemo(
    () => filteredUsers.slice(0, visibleCount),
    [filteredUsers, visibleCount],
  );

  const totalUsers = rows.length;
  const visibleUsers = displayedUsers.length;
  const hasMore = filteredUsers.length > visibleUsers;

  const sheetTitleText = isArabic
    ? sheetMode === "view"
      ? "تفاصيل المستخدم"
      : "تعديل المستخدم"
    : sheetMode === "view"
    ? "User details"
    : "Edit user";

  const sheetDescriptionText = isArabic
    ? sheetMode === "view"
      ? "راجع جميع معلومات الملف الشخصي لهذا المستخدم."
      : "قم بتحديث معلومات المستخدم ثم احفظ التغييرات."
    : sheetMode === "view"
    ? "Review the full profile information for this user."
    : "Update the user information and save the changes.";

  const sheetPrimaryButtonText = sheetSaving
    ? isArabic
      ? "جارٍ الحفظ..."
      : "Saving..."
    : isArabic
    ? "حفظ التغييرات"
    : "Save changes";

  return (
    <div className="px-4 lg:px-6" dir="ltr">
      <div className="mb-6 space-y-1 max-w-6xl mx-auto" dir={isArabic ? "rtl" : "ltr"}>
        <h1 className="text-2xl font-semibold text-[#0b0b2b]">
          {isArabic ? "المستخدمون" : "Users"}
        </h1>
        <p className="text-sm text-gray-500">
          {isArabic
            ? "قائمة المستخدمين مع المعلومات الأساسية وحالة التحقق."
            : "List of users with basic profile and verification details."}
        </p>
      </div>

      <Card className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-gray-100 bg-white/95 shadow-[0_10px_40px_rgba(13,13,18,0.05)]">
        <CardHeader
          dir={isArabic ? "rtl" : "ltr"}
          className="flex flex-col gap-4 border-b border-gray-100 bg-gradient-to-r from-teal-50/80 via-white to-sky-50/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className={`space-y-1 ${isArabic ? "text-right" : "text-left"}`}>
            <CardTitle className="text-base font-semibold text-[#0b0b2b]">
              {isArabic ? "دليل المستخدمين" : "Users directory"}
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              {isArabic
                ? "متصل بواجهة برمجة تطبيقات المستخدمين الخاصة بلوحة التحكم مع البحث وعوامل التصفية والإجراءات السريعة."
                : "Connected to your admin users API with search, filters, and quick actions."}
            </CardDescription>
          </div>
          <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <div className="inline-flex w-fit items-center justify-center gap-2 self-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-teal-800 shadow-sm ring-1 ring-teal-100/80">
              <span className="mr-1 text-[10px] uppercase tracking-wide text-teal-500">
                {isArabic ? "المستخدمون" : "Users"}
              </span>
              <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-700">
                {visibleUsers}
              </span>
              <span className="mx-1 text-[10px] text-gray-400">{isArabic ? "من" : "of"}</span>
              <span className="text-[11px] text-gray-700">{totalUsers}</span>
            </div>
            <ToggleGroup
              type="single"
              value={roleFilter}
              onValueChange={(val) => {
                if (!val) return;
                setRoleFilter(val as "all" | "influencer" | "normal");
              }}
              variant="outline"
              size="sm"
              spacing={0}
              className="rounded-full bg-white/80 px-1 text-[11px] shadow-sm ring-1 ring-teal-100/70 sm:max-w-none"
            >
              <ToggleGroupItem
                value="all"
                className="rounded-full px-3 py-1 text-[11px] font-medium text-gray-600 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm data-[state=on]:ring-1 data-[state=on]:ring-primary/40 data-[state=on]:hover:bg-primary/90"
              >
                {isArabic ? "الكل" : "All"}
              </ToggleGroupItem>
              <ToggleGroupItem
                value="influencer"
                className="rounded-full px-3 py-1 text-[11px] font-medium text-gray-600 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm data-[state=on]:ring-1 data-[state=on]:ring-primary/40 data-[state=on]:hover:bg-primary/90"
              >
                {isArabic ? "المؤثرون" : "Influencers"}
              </ToggleGroupItem>
              <ToggleGroupItem
                value="normal"
                className="rounded-full px-3 py-1 text-[11px] font-medium text-gray-600 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm data-[state=on]:ring-1 data-[state=on]:ring-primary/40 data-[state=on]:hover:bg-primary/90"
              >
                {isArabic ? "العاديون" : "Normal"}
              </ToggleGroupItem>
            </ToggleGroup>
            <div className="w-full sm:w-auto sm:min-w-[220px]">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={
                  isArabic
                    ? "ابحث بالاسم أو البريد الإلكتروني أو اسم المستخدم أو رقم الجوال"
                    : "Search by name, email, username, phone"
                }
                className="h-9 w-full rounded-full border border-teal-100 bg-white/90 px-3 text-xs text-gray-800 shadow-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
              />
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
              {/* Desktop / tablet table */}
              <div className="hidden md:block overflow-x-auto">
                <div className="max-h-[560px] overflow-y-auto">
                  <Table className="min-w-full table-auto border-separate border-spacing-0 text-xs md:text-sm">
                    <TableHeader>
                      <TableRow className="sticky top-0 z-10 bg-gray-50/95 text-[11px] uppercase tracking-wide text-gray-500 backdrop-blur">
                        <TableHead className="border-b border-gray-100 px-3 py-3 text-left font-medium w-12">
                          ID
                        </TableHead>
                        <TableHead className="border-b border-gray-100 px-3 py-3 text-left font-medium w-24">
                          Influencer
                        </TableHead>
                        <TableHead className="border-b border-gray-100 px-3 py-3 text-left font-medium w-24">
                          Verified
                        </TableHead>
                        <TableHead className="border-b border-gray-100 px-3 py-3 text-left font-medium">
                          User
                        </TableHead>
                        <TableHead className="border-b border-gray-100 px-3 py-3 text-left font-medium hidden sm:table-cell">
                          Email
                        </TableHead>
                        <TableHead className="border-b border-gray-100 px-3 py-3 text-left font-medium hidden lg:table-cell">
                          Phone
                        </TableHead>
                        <TableHead className="border-b border-gray-100 px-3 py-3 text-left font-medium hidden xl:table-cell">
                          Bio
                        </TableHead>
                        <TableHead className="border-b border-gray-100 px-3 py-3 text-left font-medium">
                          Area of expertise
                        </TableHead>
                        <TableHead className="border-b border-gray-100 px-6 py-3 text-left font-medium">
                          Username
                        </TableHead>
                        <TableHead className="border-b border-gray-100 px-3 py-3 text-left font-medium hidden lg:table-cell max-w-[22rem]">
                          ID docs
                        </TableHead>
                        <TableHead className="border-b border-gray-100 px-3 py-3 text-left font-medium w-20">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedUsers.map((user) => (
                        <TableRow
                          key={user.id}
                          className="border-t border-gray-50 odd:bg-white even:bg-gray-50/40 hover:bg-teal-50/40 transition-colors"
                        >
                          <TableCell className="px-3 py-3 align-middle text-xs text-gray-500">
                            {user.id}
                          </TableCell>
                          <TableCell className="px-3 py-3 align-middle text-xs">
                            <BooleanBadge
                              value={user.is_influencer}
                              yesLabel={isArabic ? "نعم" : "Yes"}
                              noLabel={isArabic ? "لا" : "No"}
                            />
                          </TableCell>
                          <TableCell className="px-3 py-3 align-middle text-xs">
                            {user.is_verified ? (
                              <BooleanBadge
                                value={true}
                                yesLabel={isArabic ? "نعم" : "Yes"}
                                noLabel={isArabic ? "لا" : "No"}
                              />
                            ) : (
                              <Button
                                type="button"
                                size="sm"
                                disabled={inlineSavingId === user.id || sheetSaving}
                                onClick={() => void handleToggleVerified(user, true)}
                                className="h-7 rounded-full bg-emerald-500 px-3 text-[11px] font-medium text-white shadow-sm hover:bg-emerald-600"
                              >
                                {inlineSavingId === user.id ? (
                                  <span className="flex items-center justify-center gap-1">
                                    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/80 border-t-transparent" />
                                    <span>Verifying</span>
                                  </span>
                                ) : (
                                  "Verify"
                                )}
                              </Button>
                            )}
                          </TableCell>
                          <TableCell className="px-3 py-3 align-middle">
                            <span className="text-sm font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </span>
                          </TableCell>
                          <TableCell className="px-3 py-3 align-middle text-xs text-gray-700 hidden sm:table-cell max-w-[11rem] truncate whitespace-nowrap overflow-hidden">
                            {user.email}
                          </TableCell>
                          <TableCell className="px-3 py-3 align-middle text-xs text-gray-700 hidden lg:table-cell max-w-[8rem] truncate whitespace-nowrap overflow-hidden">
                            {user.phone}
                          </TableCell>
                          <TableCell className="px-3 py-3 align-middle text-xs text-gray-600 max-w-[10rem] hidden xl:table-cell">
                            <span className="line-clamp-2 md:line-clamp-3 break-words">{user.bio}</span>
                          </TableCell>
                          <TableCell className="px-3 py-3 align-middle text-xs text-gray-700 max-w-[9rem]">
                            <span className="line-clamp-2 md:line-clamp-3 break-words">{user.area_of_expertise}</span>
                          </TableCell>
                          <TableCell className="px-6 py-3 align-middle text-xs text-gray-700 max-w-[7rem] truncate whitespace-nowrap overflow-hidden">
                            {user.username}
                          </TableCell>
                          <TableCell className="px-3 py-3 align-middle text-xs text-gray-600 wrap-break-word hidden lg:table-cell min-w-0 max-w-[8rem]">
                            <div className="space-y-1">
                              {user.id_card_face ? (
                                <a
                                  href={user.id_card_face}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={user.id_card_face}
                                  className="block max-w-full truncate whitespace-nowrap overflow-hidden text-teal-600 hover:underline text-[11px]"
                                >
                                  📄 {formatShortUrl(user.id_card_face)}
                                </a>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                              {user.id_card_back ? (
                                <a
                                  href={user.id_card_back}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={user.id_card_back}
                                  className="block max-w-full truncate whitespace-nowrap overflow-hidden text-teal-600 hover:underline text-[11px]"
                                >
                                  📄 {formatShortUrl(user.id_card_back)}
                                </a>
                              ) : (
                                <span className="text-gray-400 text-[11px]">-</span>
                              )}
                            </div>
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
                              <DropdownMenuContent align="end" className="w-32 rounded-lg">
                                <DropdownMenuItem
                                  className="text-xs"
                                  onClick={() => handleOpenSheet("view", user)}
                                >
                                  View details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-xs"
                                  onClick={() => handleOpenSheet("edit", user)}
                                >
                                  Edit user
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-xs text-red-600 focus:text-red-600"
                                  onClick={() => openDeleteDialog(user)}
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

              {/* Mobile stacked cards */}
              <div className="space-y-3 px-4 py-4 md:hidden">
                {displayedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="font-mono text-[11px] text-gray-600">ID {user.id}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-gray-500">Influencer</span>
                        <BooleanBadge
                          value={user.is_influencer}
                          yesLabel={isArabic ? "نعم" : "Yes"}
                          noLabel={isArabic ? "لا" : "No"}
                        />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="mt-0.5 truncate text-[11px] text-gray-500">
                          @{user.username}
                        </div>
                      </div>
                      <div className="shrink-0">
                        {user.is_verified ? (
                          <BooleanBadge
                            value={true}
                            yesLabel={isArabic ? "نعم" : "Yes"}
                            noLabel={isArabic ? "لا" : "No"}
                          />
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            disabled={inlineSavingId === user.id || sheetSaving}
                            onClick={() => void handleToggleVerified(user, true)}
                            className="h-7 rounded-full bg-emerald-500 px-3 text-[11px] font-medium text-white shadow-sm hover:bg-emerald-600"
                          >
                            {inlineSavingId === user.id ? (
                              <span className="flex items-center justify-center gap-1">
                                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/80 border-t-transparent" />
                                <span>Verifying</span>
                              </span>
                            ) : (
                              "Verify"
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 space-y-1 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-500">Email</span>
                        <span className="max-w-[60%] truncate text-right text-gray-700">
                          {user.email}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-500">Phone</span>
                        <span className="max-w-[60%] truncate text-right text-gray-700">
                          {user.phone}
                        </span>
                      </div>
                      {user.area_of_expertise && (
                        <div className="flex items-start justify-between gap-2">
                          <span className="mt-0.5 text-gray-500">Expertise</span>
                          <span className="max-w-[60%] text-right text-[11px] text-gray-700">
                            {user.area_of_expertise}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full px-3 text-[11px]"
                        onClick={() => handleOpenSheet("view", user)}
                      >
                        View
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full px-3 text-[11px]"
                        onClick={() => handleOpenSheet("edit", user)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full px-3 text-[11px] text-red-600 hover:text-red-700"
                        onClick={() => openDeleteDialog(user)}
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
                Load more users
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      {deleteOpen && deleteUser && (
        <div 
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4"
          onClick={(e) => {
            // Close modal if clicking on backdrop
            if (e.target === e.currentTarget && !deleteSaving) {
              setDeleteOpen(false);
              setDeleteUser(null);
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">Delete user</h2>
              <p className="mt-1 text-xs text-gray-500">
                Are you sure you want to delete @{deleteUser.username}? This action cannot be undone.
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
                    Deleting...
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
                  setDeleteUser(null);
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

          {activeUser && (
            <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <Label className="text-[11px] text-gray-500">
                    {isArabic ? "المعرف" : "ID"}
                  </Label>
                  <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                    {activeUser.id}
                  </div>
                </div>
                <div>
                  <Label className="text-[11px] text-gray-500">
                    {isArabic ? "اسم المستخدم" : "Username"}
                  </Label>
                  {sheetMode === "view" ? (
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                      {activeUser.username}
                    </div>
                  ) : (
                    <Input
                      value={editValues?.username ?? ""}
                      onChange={(e) => handleEditFieldChange("username", e.target.value)}
                      className="mt-1 h-8 text-[13px]"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <Label className="text-[11px] text-gray-500">
                    {isArabic ? "الاسم الأول" : "First name"}
                  </Label>
                  {sheetMode === "view" ? (
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                      {activeUser.first_name}
                    </div>
                  ) : (
                    <Input
                      value={editValues?.first_name ?? ""}
                      onChange={(e) => handleEditFieldChange("first_name", e.target.value)}
                      className="mt-1 h-8 text-[13px]"
                    />
                  )}
                </div>
                <div>
                  <Label className="text-[11px] text-gray-500">
                    {isArabic ? "اسم العائلة" : "Last name"}
                  </Label>
                  {sheetMode === "view" ? (
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                      {activeUser.last_name}
                    </div>
                  ) : (
                    <Input
                      value={editValues?.last_name ?? ""}
                      onChange={(e) => handleEditFieldChange("last_name", e.target.value)}
                      className="mt-1 h-8 text-[13px]"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <Label className="text-[11px] text-gray-500">
                    {isArabic ? "البريد الإلكتروني" : "Email"}
                  </Label>
                  {sheetMode === "view" ? (
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                      {activeUser.email}
                    </div>
                  ) : (
                    <Input
                      type="email"
                      value={editValues?.email ?? ""}
                      onChange={(e) => handleEditFieldChange("email", e.target.value)}
                      className="mt-1 h-8 text-[13px]"
                    />
                  )}
                </div>
                <div>
                  <Label className="text-[11px] text-gray-500">
                    {isArabic ? "رقم الجوال" : "Phone"}
                  </Label>
                  {sheetMode === "view" ? (
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                      {activeUser.phone}
                    </div>
                  ) : (
                    <Input
                      value={editValues?.phone ?? ""}
                      onChange={(e) => handleEditFieldChange("phone", e.target.value)}
                      className="mt-1 h-8 text-[13px]"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 text-xs">
                <div>
                  <Label className="text-[11px] text-gray-500">
                    {isArabic ? "نبذة" : "Bio"}
                  </Label>
                  {sheetMode === "view" ? (
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                      {activeUser.bio || "-"}
                    </div>
                  ) : (
                    <textarea
                      value={editValues?.bio ?? ""}
                      onChange={(e) => handleEditFieldChange("bio", e.target.value)}
                      rows={3}
                      className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-800 shadow-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                    />
                  )}
                </div>
                <div>
                  <Label className="text-[11px] text-gray-500">
                    {isArabic ? "مجال الخبرة" : "Area of expertise"}
                  </Label>
                  {sheetMode === "view" ? (
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                      {activeUser.area_of_expertise || "-"}
                    </div>
                  ) : (
                    <textarea
                      value={editValues?.area_of_expertise ?? ""}
                      onChange={(e) => handleEditFieldChange("area_of_expertise", e.target.value)}
                      rows={2}
                      className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-800 shadow-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                    />
                  )}
                </div>
              </div>

              {sheetMode === "edit" && (
                <div className="grid grid-cols-1 gap-3 rounded-md border border-teal-100 bg-teal-50/30 px-3 py-3 text-xs">
                  <div>
                    <Label className="text-[11px] font-medium text-teal-900">
                      {isArabic ? "صورة المستخدم" : "Profile Picture"}
                    </Label>
                    <div className="mt-2 text-[12px] text-gray-600">
                      {activeUser.picture && (
                        <p className="mb-2 rounded-sm bg-white px-2 py-1">
                          {isArabic ? "الصورة الحالية: " : "Current: "}
                          <span className="truncate font-mono text-[11px]">{formatShortUrl(activeUser.picture)}</span>
                        </p>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPictureFile(e.target.files?.[0] ?? null)}
                        className="block w-full text-[11px] file:mr-3 file:rounded-md file:border-0 file:bg-teal-100 file:px-2 file:py-1 file:text-[11px] file:font-medium file:text-teal-900 hover:file:bg-teal-200"
                      />
                      {pictureFile && (
                        <p className="mt-1 text-[11px] text-emerald-700">✓ {pictureFile.name} ({(pictureFile.size / 1024).toFixed(2)} KB)</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-[11px] font-medium text-teal-900">
                      {isArabic ? "الهوية (الوجه الأمامي)" : "ID Card (Front)"}
                    </Label>
                    <div className="mt-2 text-[12px] text-gray-600">
                      {activeUser.id_card_face && (
                        <p className="mb-2 rounded-sm bg-white px-2 py-1">
                          {isArabic ? "الملف الحالي: " : "Current: "}
                          <span className="truncate font-mono text-[11px]">{formatShortUrl(activeUser.id_card_face)}</span>
                        </p>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setIdCardFaceFile(e.target.files?.[0] ?? null)}
                        className="block w-full text-[11px] file:mr-3 file:rounded-md file:border-0 file:bg-teal-100 file:px-2 file:py-1 file:text-[11px] file:font-medium file:text-teal-900 hover:file:bg-teal-200"
                      />
                      {idCardFaceFile && (
                        <p className="mt-1 text-[11px] text-emerald-700">✓ {idCardFaceFile.name} ({(idCardFaceFile.size / 1024).toFixed(2)} KB)</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-[11px] font-medium text-teal-900">
                      {isArabic ? "الهوية (الوجه الخلفي)" : "ID Card (Back)"}
                    </Label>
                    <div className="mt-2 text-[12px] text-gray-600">
                      {activeUser.id_card_back && (
                        <p className="mb-2 rounded-sm bg-white px-2 py-1">
                          {isArabic ? "الملف الحالي: " : "Current: "}
                          <span className="truncate font-mono text-[11px]">{formatShortUrl(activeUser.id_card_back)}</span>
                        </p>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setIdCardBackFile(e.target.files?.[0] ?? null)}
                        className="block w-full text-[11px] file:mr-3 file:rounded-md file:border-0 file:bg-teal-100 file:px-2 file:py-1 file:text-[11px] file:font-medium file:text-teal-900 hover:file:bg-teal-200"
                      />
                      {idCardBackFile && (
                        <p className="mt-1 text-[11px] text-emerald-700">✓ {idCardBackFile.name} ({(idCardBackFile.size / 1024).toFixed(2)} KB)</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <Label className="text-[11px] text-gray-500">
                    {isArabic ? "مؤثر" : "Influencer"}
                  </Label>
                  <div className="mt-1">
                    <BooleanBadge
                      value={sheetMode === "view" ? activeUser.is_influencer : Boolean(editValues?.is_influencer)}
                      yesLabel={isArabic ? "نعم" : "Yes"}
                      noLabel={isArabic ? "لا" : "No"}
                    />
                  </div>
                  {sheetMode === "edit" && (
                    <div className="mt-2 flex gap-2 text-[11px] text-gray-600">
                      <button
                        type="button"
                        onClick={() => handleEditFieldChange("is_influencer", true)}
                        className={`rounded-full px-2 py-1 border text-[11px] ${editValues?.is_influencer ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 bg-white"}`}
                      >
                        {isArabic ? "نعم" : "Yes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditFieldChange("is_influencer", false)}
                        className={`rounded-full px-2 py-1 border text-[11px] ${editValues?.is_influencer === false ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 bg-white"}`}
                      >
                        {isArabic ? "لا" : "No"}
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-[11px] text-gray-500">
                    {isArabic ? "موثق" : "Verified"}
                  </Label>
                  <div className="mt-1">
                    <BooleanBadge
                      value={sheetMode === "view" ? activeUser.is_verified : Boolean(editValues?.is_verified)}
                      yesLabel={isArabic ? "نعم" : "Yes"}
                      noLabel={isArabic ? "لا" : "No"}
                    />
                  </div>
                  {sheetMode === "edit" && (
                    <div className="mt-2 flex gap-2 text-[11px] text-gray-600">
                      <button
                        type="button"
                        onClick={() => handleEditFieldChange("is_verified", true)}
                        className={`rounded-full px-2 py-1 border text-[11px] ${editValues?.is_verified ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 bg-white"}`}
                      >
                        {isArabic ? "نعم" : "Yes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditFieldChange("is_verified", false)}
                        className={`rounded-full px-2 py-1 border text-[11px] ${editValues?.is_verified === false ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 bg-white"}`}
                      >
                        {isArabic ? "لا" : "No"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <SheetFooter>
            {sheetMode === "edit" ? (
              <Button
                type="button"
                onClick={handleSaveUser}
                disabled={sheetSaving}
                className="w-full rounded-full bg-primary text-white hover:bg-primary/90"
              >
                {sheetPrimaryButtonText}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => setSheetOpen(false)}
                variant="outline"
                className="w-full rounded-full"
              >
                {isArabic ? "إغلاق" : "Close"}
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
