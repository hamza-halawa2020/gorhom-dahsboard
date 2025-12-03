export interface PostComment {
  id?: number;
  user_id?: number;
  user?: string;
  admin_id?: number;
  admin?: string;
  post_id?: number;
  post?: string;
  comment?: string;
  status?: string;
  created_at?: Date | string;
}
