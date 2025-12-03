export interface Course {
  id?: number;
  admin_id?: number;
  admin?: string;
  category_id?: string;
  category?: string;
  tag_id?: string;
  tag?: string;
  instructor_id?: string;
  instructor?: string;
  title?: string;
  description?: string;
  video_url?: string;
  image?: string;
  price?: string;
  certifications?: boolean;
  created_at?: Date | string;
}
