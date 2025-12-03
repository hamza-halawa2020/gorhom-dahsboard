export interface Product {
  id?: number;
  title?: string;
  description?: string;
  image?: string;
  stock?: boolean;
  priceBeforeDiscount?: string;
  discount?: string;
  priceAfterDiscount?: string;
  category_id?: string;
  category?: string;
  admin_id?: number;
  admin?: string;
  productImages?: string[];
  productReviews?: string;
  created_at?: Date | string;
}
