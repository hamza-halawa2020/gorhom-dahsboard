export interface Event {
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
  eventImages?: string[];
  created_at?: Date | string;
}
