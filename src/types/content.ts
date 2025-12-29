export interface Content {
  id: number;
  name: string;
  description: string;
  subcategory: number;
  creator: number;
  creator_name?: string; // For display purposes
  price: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ContentInput {
  name: string;
  description: string;
  subcategory: number;
  creator: number; // Backend requires this - user ID of the creator
  price: number;
  is_published: boolean;
}

export interface ContentWithLessons extends Content {
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  name: string;
  text: string;
  video: string | null;
  file: string | null;
  content: number;
  order?: number;  // Order within the content
  content_name?: string; // For display purposes
  created_at?: string;
  updated_at?: string;
}

export interface LessonInput {
  name: string;  // Maps to 'title' in backend
  text: string;
  video?: File | null;
  file?: File | null;
  content: number;
  order?: number;  // Order within the content (auto-calculated if not provided)
  creator?: number;  // Backend requires this - user ID of the creator
}
