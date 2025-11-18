"use client";

import { useMemo, useState } from "react";
import { IconDotsVertical } from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock users data for now
const users = [
  {
    id: 1,
    first_name: "Ziad",
    last_name: "Ramzy",
    username: "ziad.ramzy",
    email: "ziad@example.com",
    phone: "+966 55 123 4567",
    bio: "Frontend engineer & course creator",
    area_of_expertise: "React, Next.js, TypeScript",
    picture: "ZR",
    is_influencer: true,
    is_verified: true,
    id_card_face: "id_face_001.jpg",
    id_card_back: "id_back_001.jpg",
  },
  {
    id: 2,
    first_name: "Sara",
    last_name: "Al Harbi",
    username: "sara.harbi",
    email: "sara@example.com",
    phone: "+966 55 987 6543",
    bio: "Content creator in marketing & branding",
    area_of_expertise: "Digital marketing, Branding",
    picture: "SA",
    is_influencer: true,
    is_verified: false,
    id_card_face: "id_face_002.jpg",
    id_card_back: "id_back_002.jpg",
  },
  {
    id: 3,
    first_name: "Omar",
    last_name: "Khaled",
    username: "omar.khaled",
    email: "omar@example.com",
    phone: "+966 50 222 3344",
    bio: "Data analyst & instructor",
    area_of_expertise: "Data analysis, Python, BI",
    picture: "OK",
    is_influencer: false,
    is_verified: true,
    id_card_face: "id_face_003.jpg",
    id_card_back: "id_back_003.jpg",
  },
  {
    id: 4,
    first_name: "Laila",
    last_name: "Hassan",
    username: "laila.hassan",
    email: "laila@example.com",
    phone: "+966 54 111 2233",
    bio: "UI/UX designer helping creators build better products",
    area_of_expertise: "Product design, Figma, UX research",
    picture: "LH",
    is_influencer: true,
    is_verified: true,
    id_card_face: "id_face_004.jpg",
    id_card_back: "id_back_004.jpg",
  },
  {
    id: 5,
    first_name: "Khalid",
    last_name: "Al Saud",
    username: "khalid.sa",
    email: "khalid@example.com",
    phone: "+966 50 999 8877",
    bio: "Business coach for freelancers and small teams",
    area_of_expertise: "Freelancing, Business strategy",
    picture: "KS",
    is_influencer: true,
    is_verified: false,
    id_card_face: "id_face_005.jpg",
    id_card_back: "id_back_005.jpg",
  },
  {
    id: 6,
    first_name: "Mona",
    last_name: "Yousef",
    username: "mona.yousef",
    email: "mona@example.com",
    phone: "+966 53 444 5566",
    bio: "Content strategist for educational platforms",
    area_of_expertise: "Content strategy, Copywriting",
    picture: "MY",
    is_influencer: false,
    is_verified: true,
    id_card_face: "id_face_006.jpg",
    id_card_back: "id_back_006.jpg",
  },
  {
    id: 7,
    first_name: "Ahmed",
    last_name: "Nasser",
    username: "ahmed.nasser",
    email: "ahmed@example.com",
    phone: "+966 55 777 8899",
    bio: "Video creator and course producer",
    area_of_expertise: "Video production, Editing",
    picture: "AN",
    is_influencer: true,
    is_verified: true,
    id_card_face: "id_face_007.jpg",
    id_card_back: "id_back_007.jpg",
  },
  {
    id: 8,
    first_name: "Huda",
    last_name: "Saleh",
    username: "huda.saleh",
    email: "huda@example.com",
    phone: "+966 56 321 7654",
    bio: "Instructor focusing on productivity and planning",
    area_of_expertise: "Productivity, Notion, Planning",
    picture: "HS",
    is_influencer: false,
    is_verified: true,
    id_card_face: "id_face_008.jpg",
    id_card_back: "id_back_008.jpg",
  },
];

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
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState(users);

  const handleDelete = (id: number) => {
    setRows((prev) => prev.filter((user) => user.id !== id));
  };

  const handleAccept = (id: number) => {
    setRows((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              is_verified: true,
            }
          : user
      )
    );
  };

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    const source = rows;
    if (!q) return source;

    return source.filter((user) => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      return (
        fullName.includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.username.toLowerCase().includes(q) ||
        user.phone.toLowerCase().includes(q)
      );
    });
  }, [search, rows]);

  const totalUsers = rows.length;
  const visibleUsers = filteredUsers.length;

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
              Mock data for now – later you can connect this to your backend users API.
            </CardDescription>
          </div>
          <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
            <span className="inline-flex h-7 items-center justify-center rounded-full bg-white/90 px-3 text-[11px] font-medium text-teal-700 ring-1 ring-teal-100">
              {visibleUsers} of {totalUsers} users
            </span>
            <div className="w-full max-w-xs">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, username, phone"
                className="h-9 w-full rounded-full border border-teal-100 bg-white/90 px-3 text-xs text-gray-800 shadow-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[560px] overflow-y-auto">
            <Table className="min-w-full table-fixed border-separate border-spacing-0 text-xs md:text-sm">
              <TableHeader>
                <TableRow className="sticky top-0 z-10 bg-gray-50/95 text-[11px] uppercase tracking-wide text-gray-500 backdrop-blur">
                  <TableHead className="border-b border-gray-100 px-4 py-3 text-left font-medium">ID</TableHead>
                  <TableHead className="border-b border-gray-100 px-4 py-3 text-left font-medium">Influencer</TableHead>
                  <TableHead className="border-b border-gray-100 px-4 py-3 text-left font-medium">User</TableHead>
                  <TableHead className="border-b border-gray-100 px-4 py-3 text-left font-medium">Email</TableHead>
                  <TableHead className="border-b border-gray-100 px-4 py-3 text-left font-medium">Phone</TableHead>
                  <TableHead className="border-b border-gray-100 px-4 py-3 text-left font-medium">Bio</TableHead>
                  <TableHead className="border-b border-gray-100 px-4 py-3 text-left font-medium">Area of expertise</TableHead>
                  <TableHead className="border-b border-gray-100 px-4 py-3 text-left font-medium">Username</TableHead>
                  <TableHead className="border-b border-gray-100 px-4 py-3 text-left font-medium">ID docs</TableHead>
                  <TableHead className="border-b border-gray-100 px-4 py-3 text-left font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-t border-gray-50 odd:bg-white even:bg-gray-50/40 hover:bg-teal-50/40 transition-colors"
                  >
                    <TableCell className="px-4 py-3 align-middle text-xs text-gray-500">
                      {user.id}
                    </TableCell>
                    <TableCell className="px-4 py-3 align-middle text-xs">
                      <BooleanBadge value={user.is_influencer} />
                    </TableCell>
                    <TableCell className="px-4 py-3 align-middle">
                      <span className="text-sm font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 align-middle text-xs text-gray-700 wrap-break-word">
                      {user.email}
                    </TableCell>
                    <TableCell className="px-4 py-3 align-middle text-xs text-gray-700 wrap-break-word">
                      {user.phone}
                    </TableCell>
                    <TableCell className="px-4 py-3 align-middle text-xs text-gray-600 max-w-xs">
                      <span className="line-clamp-2 md:line-clamp-3 wrap-break-word">{user.bio}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 align-middle text-xs text-gray-700 max-w-xs">
                      <span className="line-clamp-2 md:line-clamp-3 wrap-break-word">{user.area_of_expertise}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 align-middle text-xs text-gray-700 wrap-break-word">
                      {user.username}
                    </TableCell>
                    <TableCell className="px-4 py-3 align-middle text-xs text-gray-600 wrap-break-word">
                      <div className="space-y-1">
                        <div>{user.id_card_face}</div>
                        <div className="text-gray-400 text-[11px]">{user.id_card_back}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 align-middle text-xs text-gray-700">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-teal-300 hover:text-teal-600 hover:shadow-md"
                          >
                            <IconDotsVertical className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-28 rounded-lg">
                          <DropdownMenuItem
                            className="text-xs"
                            onClick={() => handleAccept(user.id)}
                          >
                            Accept
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-xs text-red-600 focus:text-red-600"
                            onClick={() => handleDelete(user.id)}
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
        </CardContent>
      </Card>
    </div>
  );
}
