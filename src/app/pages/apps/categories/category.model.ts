export interface Category {
  id?: number;
  name?: string;
  image?: string | File;  // Add image property
  created_at?: Date | string;
}
