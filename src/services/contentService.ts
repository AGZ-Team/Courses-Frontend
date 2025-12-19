import type { Content, ContentInput } from "@/types/content";

let contentCache: Content[] | null = null;

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
 * Fetch all content
 * Backend filters based on user role:
 * - Superuser: sees all content
 * - Instructor: sees own content
 * - Normal user: sees published content
 */
export async function fetchContent(): Promise<Content[]> {
  if (contentCache) {
    return contentCache;
  }

  const res = await fetch("/api/admin/content", {
    method: "GET",
    credentials: "include",
  });
  const data = await handleResponse<Content[]>(res);
  contentCache = data;
  return data;
}

/**
 * Clear content cache - useful after role changes or logout
 */
export function clearContentCache(): void {
  contentCache = null;
}

/**
 * Get single content by ID
 */
export async function getContent(id: number): Promise<Content> {
  const res = await fetch(`/api/admin/content/${id}`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse<Content>(res);
}

/**
 * Create new content
 */
export async function createContent(data: ContentInput): Promise<Content> {
  console.log('[contentService] Creating content with payload:', JSON.stringify(data, null, 2));
  
  const res = await fetch("/api/admin/content", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  console.log('[contentService] Response status:', res.status);
  const responseText = await res.text();
  console.log('[contentService] Response body:', responseText);

  // Parse response
  let responseData: Content | { error: string };
  try {
    responseData = JSON.parse(responseText);
  } catch (e) {
    console.error('[contentService] Failed to parse response:', e);
    throw new Error(`Failed to parse response: ${responseText}`);
  }

  // Check if response is an error
  if (!res.ok || 'error' in responseData) {
    const errorMessage = 'error' in responseData ? responseData.error : `Request failed with status ${res.status}`;
    console.error('[contentService] Error creating content:', errorMessage);
    throw new Error(errorMessage);
  }

  const created = responseData as Content;

  if (contentCache) {
    contentCache = [...contentCache, created];
  }

  return created;
}

/**
 * Update existing content
 */
export async function updateContent(
  id: number,
  data: Partial<ContentInput>,
): Promise<Content> {
  const res = await fetch(`/api/admin/content/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const updated = await handleResponse<Content>(res);

  if (contentCache) {
    contentCache = contentCache.map((content) =>
      content.id === id ? updated : content,
    );
  }

  return updated;
}

/**
 * Delete content by ID
 */
export async function deleteContent(id: number): Promise<void> {
  const res = await fetch(`/api/admin/content/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  await handleResponse<unknown>(res);

  if (contentCache) {
    contentCache = contentCache.filter((content) => content.id !== id);
  }
}
