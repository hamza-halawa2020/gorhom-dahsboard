export interface Post {
  id?: number;
  admin_id?: number;
  admin?: string;
  category_id?: string;
  category?: string;
  tag_id?: string;
  tag?: string;
  title?: string;
  content?: string;
  image?: string;
  postComments?: string[];
  created_at?: Date | string;
  status?: string;
}
