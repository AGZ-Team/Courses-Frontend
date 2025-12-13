"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconFileText, IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";

export default function MyContentPanel() {
  const locale = useLocale();
  const isAr = locale === "ar";

  // Mock data - replace with actual API call
  const [content] = useState([
    {
      id: 1,
      title: "Introduction to React",
      type: "Course",
      status: "Published",
      students: 150,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      title: "Advanced TypeScript",
      type: "Course",
      status: "Draft",
      students: 0,
      createdAt: "2024-02-01",
    },
  ]);

  return (
    <div className="px-4 lg:px-6">
      <div className="mb-6 space-y-1 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#0b0b2b]">
              {isAr ? "محتواي" : "My Content"}
            </h1>
            <p className="text-sm text-gray-500">
              {isAr
                ? "إدارة الدورات والمحتوى الخاص بك"
                : "Manage your courses and content"}
            </p>
          </div>
          <Button className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90">
            <IconPlus className="h-4 w-4 mr-2" />
            {isAr ? "إضافة محتوى" : "Add Content"}
          </Button>
        </div>
      </div>

      <Card className="mx-auto max-w-6xl rounded-3xl border border-gray-100 bg-white/95 shadow-[0_10px_40px_rgba(13,13,18,0.05)]">
        <div className="p-6">
          {content.length === 0 ? (
            <div className="text-center py-12">
              <IconFileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">
                {isAr
                  ? "لا يوجد محتوى بعد. ابدأ بإنشاء دورتك الأولى!"
                  : "No content yet. Start by creating your first course!"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {content.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary/40 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IconFileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0b0b2b]">{item.title}</h3>
                      <p className="text-sm text-gray-500">
                        {item.type} • {item.status} • {item.students}{" "}
                        {isAr ? "طالب" : "students"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                    >
                      <IconEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full text-red-600 hover:text-red-700"
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
