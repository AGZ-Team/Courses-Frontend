import type { Category } from "@/types/category";

type CategoryInput = Partial<Category> & {
  imageFile?: File | null;
};

let categoriesCache: Category[] | null = null;

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

export async function fetchCategories(): Promise<Category[]> {
  if (categoriesCache) {
    return categoriesCache;
  }

  const res = await fetch("/api/admin/categories", {
    method: "GET",
    credentials: "include",
  });
  const data = await handleResponse<Category[]>(res);
  categoriesCache = data;
  return data;
}

export async function createCategory(
  data: CategoryInput,
): Promise<Category> {
  const { imageFile, ...rest } = data;

  let res: Response;

  if (imageFile) {
    const formData = new FormData();
    if (typeof rest.title_arabic === "string") {
      formData.append("title_arabic", rest.title_arabic);
    }
    if (typeof rest.title_english === "string") {
      formData.append("title_english", rest.title_english);
    }
    formData.append("image", imageFile);

    res = await fetch("/api/admin/categories", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
  } else {
    res = await fetch("/api/admin/categories", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rest),
    });
  }

  const created = await handleResponse<Category>(res);

  if (categoriesCache) {
    categoriesCache = [...categoriesCache, created];
  }

  return created;
}

export async function updateCategory(
  id: number,
  data: CategoryInput,
): Promise<Category> {
  const { imageFile, ...rest } = data;

  const formData = new FormData();
  if (typeof rest.title_arabic === "string") {
    formData.append("title_arabic", rest.title_arabic);
  }
  if (typeof rest.title_english === "string") {
    formData.append("title_english", rest.title_english);
  }
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const res = await fetch(`/api/admin/categories/${id}`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  const updated = await handleResponse<Category>(res);

  if (categoriesCache) {
    categoriesCache = categoriesCache.map((category) =>
      category.id === id ? updated : category,
    );
  }

  return updated;
}

export async function deleteCategory(id: number): Promise<void> {
  const res = await fetch(`/api/admin/categories/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  await handleResponse<unknown>(res);

  if (categoriesCache) {
    categoriesCache = categoriesCache.filter((category) => category.id !== id);
  }
}
