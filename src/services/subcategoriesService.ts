import type { Subcategory } from "@/types/subcategory";

type SubcategoryInput = Partial<Subcategory>;

let subcategoriesCache: Subcategory[] | null = null;

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

export async function fetchSubcategories(): Promise<Subcategory[]> {
  if (subcategoriesCache) {
    return subcategoriesCache;
  }

  const res = await fetch("/api/admin/subcategories", {
    method: "GET",
    credentials: "include",
  });
  const data = await handleResponse<Subcategory[]>(res);
  subcategoriesCache = data;
  return data;
}

export async function createSubcategory(
  data: SubcategoryInput,
): Promise<Subcategory> {
  const res = await fetch("/api/admin/subcategories", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const created = await handleResponse<Subcategory>(res);

  if (subcategoriesCache) {
    subcategoriesCache = [...subcategoriesCache, created];
  }

  return created;
}

export async function updateSubcategory(
  id: number,
  data: SubcategoryInput,
): Promise<Subcategory> {
  const res = await fetch(`/api/admin/subcategories/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const updated = await handleResponse<Subcategory>(res);

  if (subcategoriesCache) {
    subcategoriesCache = subcategoriesCache.map((subcategory) =>
      subcategory.id === id ? updated : subcategory,
    );
  }

  return updated;
}

export async function deleteSubcategory(id: number): Promise<void> {
  const res = await fetch(`/api/admin/subcategories/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  await handleResponse<unknown>(res);

  if (subcategoriesCache) {
    subcategoriesCache = subcategoriesCache.filter((subcategory) => subcategory.id !== id);
  }
}
