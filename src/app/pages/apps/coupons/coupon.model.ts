export interface Coupon {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  discount?: number;
  max_uses?: number;
  uses_count?: number;
  start_date?: Date | string;
  end_date?: Date | string;
  is_active?: boolean;
  admin_id?: number;
  admin?: string;
  created_at?: Date | string;
}
