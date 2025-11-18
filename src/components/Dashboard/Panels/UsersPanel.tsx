"use client";

import { useEffect, useMemo, useState } from "react";
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
import { fetchAdminUsers, updateAdminUser, deleteAdminUser } from "@/services/adminUsersService";

function BooleanBadge({ value }: { value: boolean }) {
  return (
    <span
      className={
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium " +
        (value
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
          : "bg-gray-50 text-gray-600 ring-1 ring-gray-100")
      }
    >
      {value ? "Yes" : "No"}
    </span>
  );
}

export default function UsersPanel() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAdminUsers();
        if (isMounted && Array.isArray(data)) {
          setRows(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load users");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

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
    } else {
      setEditValues(null);
    }
  };

  const handleEditFieldChange = (field: keyof AdminUser, value: any) => {
    setEditValues((prev) => ({ ...(prev ?? {}), [field]: value }));
  };

  const handleSaveUser = async () => {
    if (!activeUser || !editValues) return;

    try {
      setSheetSaving(true);
      setSheetError(null);
      const payload: Partial<AdminUser> = { ...activeUser, ...editValues };
      const updated = await updateAdminUser(activeUser.id, payload);
      setRows((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      setActiveUser(updated);
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
      setRows((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
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
      await deleteAdminUser(deleteUser.id);
      setRows((prev) => prev.filter((u) => u.id !== deleteUser.id));
      if (activeUser && activeUser.id === deleteUser.id) {
        setActiveUser(null);
        setSheetOpen(false);
      }
      setDeleteOpen(false);
      setDeleteUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
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

  return (
    <div className="px-4 lg:px-6" dir="ltr">
      <div className="mb-6 space-y-1 max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-[#0b0b2b]">Users</h1>
        <p className="text-sm text-gray-500">
          List of users with basic profile and verification details.
        </p>
      </div>

      <Card className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-gray-100 bg-white/95 shadow-[0_10px_40px_rgba(13,13,18,0.05)]">
        <CardHeader className="flex flex-col gap-4 border-b border-gray-100 bg-gradient-to-r from-teal-50/80 via-white to-sky-50/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 text-left">
            <CardTitle className="text-base font-semibold text-[#0b0b2b]">
              Users directory
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Connected to your admin users API with search, filters, and quick actions.
            </CardDescription>
          </div>
          <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <div className="inline-flex w-fit items-center justify-center gap-2 self-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-teal-800 shadow-sm ring-1 ring-teal-100/80">
              <span className="mr-1 text-[10px] uppercase tracking-wide text-teal-500">Users</span>
              <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-700">
                {visibleUsers}
              </span>
              <span className="mx-1 text-[10px] text-gray-400">of</span>
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
                All
              </ToggleGroupItem>
              <ToggleGroupItem
                value="influencer"
                className="rounded-full px-3 py-1 text-[11px] font-medium text-gray-600 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm data-[state=on]:ring-1 data-[state=on]:ring-primary/40 data-[state=on]:hover:bg-primary/90"
              >
                Influencers
              </ToggleGroupItem>
              <ToggleGroupItem
                value="normal"
                className="rounded-full px-3 py-1 text-[11px] font-medium text-gray-600 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm data-[state=on]:ring-1 data-[state=on]:ring-primary/40 data-[state=on]:hover:bg-primary/90"
              >
                Normal
              </ToggleGroupItem>
            </ToggleGroup>
            <div className="w-full sm:w-auto sm:min-w-[220px]">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name, email, username, phone"
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
              <div className="hidden md:block">
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
                        <TableHead className="border-b border-gray-100 px-3 py-3 text-left font-medium hidden lg:table-cell">
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
                            <BooleanBadge value={user.is_influencer} />
                          </TableCell>
                          <TableCell className="px-3 py-3 align-middle text-xs">
                            {user.is_verified ? (
                              <BooleanBadge value={true} />
                            ) : (
                              <Button
                                type="button"
                                size="sm"
                                disabled={inlineSavingId === user.id || sheetSaving}
                                onClick={() => void handleToggleVerified(user, true)}
                                className="h-7 rounded-full bg-emerald-500 px-3 text-[11px] font-medium text-white shadow-sm hover:bg-emerald-600"
                              >
                                Verify
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
                          <TableCell className="px-3 py-3 align-middle text-xs text-gray-600 wrap-break-word hidden lg:table-cell">
                            <div className="space-y-1">
                              <div>{user.id_card_face}</div>
                              <div className="text-gray-400 text-[11px]">{user.id_card_back}</div>
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
                        <BooleanBadge value={user.is_influencer} />
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
                          <BooleanBadge value={true} />
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            disabled={inlineSavingId === user.id || sheetSaving}
                            onClick={() => void handleToggleVerified(user, true)}
                            className="h-7 rounded-full bg-emerald-500 px-3 text-[11px] font-medium text-white shadow-sm hover:bg-emerald-600"
                          >
                            Verify
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
      {deleteOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">Delete user</h2>
              <p className="mt-1 text-xs text-gray-500">
                {deleteUser
                  ? `Are you sure you want to delete @${deleteUser.username}? This action cannot be undone.`
                  : "Are you sure you want to delete this user?"}
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-3">
              <Button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteSaving}
                className="rounded-full bg-red-600 text-white hover:bg-red-700"
              >
                {deleteSaving ? "Deleting..." : "Delete"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                disabled={deleteSaving}
                onClick={() => setDeleteOpen(false)}
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
            <SheetTitle>{sheetMode === "view" ? "User details" : "Edit user"}</SheetTitle>
            <SheetDescription>
              {sheetMode === "view"
                ? "Review the full profile information for this user."
                : "Update the user information and save the changes."}
            </SheetDescription>
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
                  <Label className="text-[11px] text-gray-500">ID</Label>
                  <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                    {activeUser.id}
                  </div>
                </div>
                <div>
                  <Label className="text-[11px] text-gray-500">Username</Label>
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
                  <Label className="text-[11px] text-gray-500">First name</Label>
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
                  <Label className="text-[11px] text-gray-500">Last name</Label>
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
                  <Label className="text-[11px] text-gray-500">Email</Label>
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
                  <Label className="text-[11px] text-gray-500">Phone</Label>
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
                  <Label className="text-[11px] text-gray-500">Bio</Label>
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
                  <Label className="text-[11px] text-gray-500">Area of expertise</Label>
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

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <Label className="text-[11px] text-gray-500">Influencer</Label>
                  <div className="mt-1">
                    <BooleanBadge value={sheetMode === "view" ? activeUser.is_influencer : Boolean(editValues?.is_influencer)} />
                  </div>
                  {sheetMode === "edit" && (
                    <div className="mt-2 flex gap-2 text-[11px] text-gray-600">
                      <button
                        type="button"
                        onClick={() => handleEditFieldChange("is_influencer", true)}
                        className={`rounded-full px-2 py-1 border text-[11px] ${editValues?.is_influencer ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 bg-white"}`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditFieldChange("is_influencer", false)}
                        className={`rounded-full px-2 py-1 border text-[11px] ${editValues?.is_influencer === false ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 bg-white"}`}
                      >
                        No
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-[11px] text-gray-500">Verified</Label>
                  <div className="mt-1">
                    <BooleanBadge value={sheetMode === "view" ? activeUser.is_verified : Boolean(editValues?.is_verified)} />
                  </div>
                  {sheetMode === "edit" && (
                    <div className="mt-2 flex gap-2 text-[11px] text-gray-600">
                      <button
                        type="button"
                        onClick={() => handleEditFieldChange("is_verified", true)}
                        className={`rounded-full px-2 py-1 border text-[11px] ${editValues?.is_verified ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 bg-white"}`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditFieldChange("is_verified", false)}
                        className={`rounded-full px-2 py-1 border text-[11px] ${editValues?.is_verified === false ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 bg-white"}`}
                      >
                        No
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <Label className="text-[11px] text-gray-500">ID card (front)</Label>
                  <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                    {activeUser.id_card_face || "-"}
                  </div>
                </div>
                <div>
                  <Label className="text-[11px] text-gray-500">ID card (back)</Label>
                  <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800">
                    {activeUser.id_card_back || "-"}
                  </div>
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
                {sheetSaving ? "Saving..." : "Save changes"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => setSheetOpen(false)}
                variant="outline"
                className="w-full rounded-full"
              >
                Close
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
