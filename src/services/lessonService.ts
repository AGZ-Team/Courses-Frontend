import type { Lesson, LessonInput } from "@/types/content";

let lessonCache: Lesson[] | null = null;

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    return res.json();
  }

  let message = `Request failed with status ${res.status}`;
  try {
    const data = await res.json();
    if (typeof data === 'object' && data !== null) {
      if ('detail' in data && typeof data.detail === "string") {
        message = data.detail;
      } else if ('error' in data && typeof data.error === "string") {
        message = data.error;
      } else {
        // Check for field-specific errors (like title: ["This field is required."])
        const fieldErrors = Object.entries(data)
          .filter(([key]) => !['detail', 'error', 'message'].includes(key))
          .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
          .join(', ');

        if (fieldErrors) {
          message = `${message} - ${fieldErrors}`;
        }
      }
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
 * Note: Backend expects 'title' field, but frontend uses 'name' for consistency
 * Order is auto-calculated based on existing lessons for the content
 */
export async function createLesson(data: LessonInput): Promise<Lesson> {
  const { video, file, ...jsonData } = data;

  // Calculate order if not provided - get max order for this content and add 1
  let order = jsonData.order;
  if (order === undefined) {
    try {
      // Clear cache to ensure we get fresh data with order field
      clearLessonCache();
      const existingLessons = await fetchLessons();
      const lessonsForContent = existingLessons.filter(l => l.content === jsonData.content);
      const maxOrder = lessonsForContent.reduce((max, l) => Math.max(max, l.order ?? 0), 0);
      order = maxOrder + 1;
      console.log(`[createLesson] Auto-calculated order: ${order} for content ${jsonData.content} (found ${lessonsForContent.length} existing lessons)`);
    } catch (e) {
      // If we can't fetch lessons, start with order 1
      order = 1;
      console.log('[createLesson] Could not fetch lessons for order calculation, using 1', e);
    }
  }

  // If we have files, use FormData
  if (video || file) {
    const formData = new FormData();
    // Backend expects 'title' not 'name'
    formData.append("title", jsonData.name);
    formData.append("text", jsonData.text);
    formData.append("content", String(jsonData.content));
    formData.append("order", String(order));
    // Add creator if provided
    if (jsonData.creator) {
      formData.append("creator", String(jsonData.creator));
    }

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

  // No files, use JSON - map 'name' to 'title' for backend
  const backendData = {
    title: jsonData.name,
    text: jsonData.text,
    content: jsonData.content,
    order: order,
    ...(jsonData.creator && { creator: jsonData.creator }),
  };

  const res = await fetch("/api/admin/lesson", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(backendData),
  });

  const created = await handleResponse<Lesson>(res);

  if (lessonCache) {
    lessonCache = [...lessonCache, created];
  }

  return created;
}

/**
 * Update existing lesson with optional file uploads
 * Note: Backend expects 'title' field, but frontend uses 'name' for consistency
 */
export async function updateLesson(
  id: number,
  data: Partial<LessonInput>,
): Promise<Lesson> {
  const { video, file, ...jsonData } = data;

  // If we have files, use FormData
  if (video || file) {
    const formData = new FormData();

    // Map 'name' to 'title' for backend
    if (jsonData.name !== undefined) {
      formData.append("title", jsonData.name);
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

  // No files, use JSON - map 'name' to 'title' for backend
  const backendData: Record<string, unknown> = {};
  if (jsonData.name !== undefined) {
    backendData.title = jsonData.name;
  }
  if (jsonData.text !== undefined) {
    backendData.text = jsonData.text;
  }
  if (jsonData.content !== undefined) {
    backendData.content = jsonData.content;
  }

  const res = await fetch(`/api/admin/lesson/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(backendData),
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
