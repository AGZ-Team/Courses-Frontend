import type { Lesson, LessonInput } from "@/types/content";

let lessonCache: Lesson[] | null = null;

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    return res.json();
  }

  let message = "Request failed";
  try {
    const data = await res.json();
    if (typeof data === 'object' && data !== null) {
      if ('detail' in data && typeof data.detail === "string") message = data.detail;
      else if ('error' in data && typeof data.error === "string") message = data.error;
    }
  } catch {
    // ignore JSON parse errors
  }

  throw new Error(message);
}

/**
 * Fetch all lessons
 * Backend filters based on user role:
 * - Superuser: sees all lessons
 * - Instructor: sees lessons of own content
 * - Normal user: sees lessons of published content they have access to
 */
export async function fetchLessons(): Promise<Lesson[]> {
  if (lessonCache) {
    return lessonCache;
  }

  const res = await fetch("/api/admin/lesson", {
    method: "GET",
    credentials: "include",
  });
  const data = await handleResponse<Lesson[]>(res);
  lessonCache = data;
  return data;
}

/**
 * Clear lesson cache - useful after role changes or logout
 */
export function clearLessonCache(): void {
  lessonCache = null;
}

/**
 * Get single lesson by ID
 */
export async function getLesson(id: number): Promise<Lesson> {
  const res = await fetch(`/api/admin/lesson/${id}`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse<Lesson>(res);
}

/**
 * Create new lesson with optional file uploads
 */
export async function createLesson(data: LessonInput): Promise<Lesson> {
  const { video, file, ...jsonData } = data;
  
  // If we have files, use FormData
  if (video || file) {
    const formData = new FormData();
    formData.append("name", jsonData.name);
    formData.append("text", jsonData.text);
    formData.append("content", String(jsonData.content));
    
    if (video) {
      formData.append("video", video);
    }
    if (file) {
      formData.append("file", file);
    }

    const res = await fetch("/api/admin/lesson", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const created = await handleResponse<Lesson>(res);

    if (lessonCache) {
      lessonCache = [...lessonCache, created];
    }

    return created;
  }

  // No files, use JSON
  const res = await fetch("/api/admin/lesson", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  });

  const created = await handleResponse<Lesson>(res);

  if (lessonCache) {
    lessonCache = [...lessonCache, created];
  }

  return created;
}

/**
 * Update existing lesson with optional file uploads
 */
export async function updateLesson(
  id: number,
  data: Partial<LessonInput>,
): Promise<Lesson> {
  const { video, file, ...jsonData } = data;
  
  // If we have files, use FormData
  if (video || file) {
    const formData = new FormData();
    
    if (jsonData.name !== undefined) {
      formData.append("name", jsonData.name);
    }
    if (jsonData.text !== undefined) {
      formData.append("text", jsonData.text);
    }
    if (jsonData.content !== undefined) {
      formData.append("content", String(jsonData.content));
    }
    if (video) {
      formData.append("video", video);
    }
    if (file) {
      formData.append("file", file);
    }

    const res = await fetch(`/api/admin/lesson/${id}`, {
      method: "PATCH",
      credentials: "include",
      body: formData,
    });

    const updated = await handleResponse<Lesson>(res);

    if (lessonCache) {
      lessonCache = lessonCache.map((lesson) =>
        lesson.id === id ? updated : lesson,
      );
    }

    return updated;
  }

  // No files, use JSON
  const res = await fetch(`/api/admin/lesson/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  });

  const updated = await handleResponse<Lesson>(res);

  if (lessonCache) {
    lessonCache = lessonCache.map((lesson) =>
      lesson.id === id ? updated : lesson,
    );
  }

  return updated;
}

/**
 * Delete lesson by ID
 */
export async function deleteLesson(id: number): Promise<void> {
  const res = await fetch(`/api/admin/lesson/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  await handleResponse<unknown>(res);

  if (lessonCache) {
    lessonCache = lessonCache.filter((lesson) => lesson.id !== id);
  }
}

/**
 * Fetch lessons for a specific content
 */
export async function fetchLessonsByContent(contentId: number): Promise<Lesson[]> {
  const allLessons = await fetchLessons();
  return allLessons.filter((lesson) => lesson.content === contentId);
}
