export interface Order {
  id?: number;
  order_number?: string;
  user_id?: number;
  user?: User; // Define as an object, not a string
  client_id?: number;
  client?: Client; // Define as an object, not a string
  orderItems?: OrderItem[]; // Define as an array of objects
  address?: Address; // Define as an object, not a string
  coupon_discount?: string;
  shipment_cost?: string;
  total_price?: string;
  notes?: string;
  payment_method?: string;
  status?: string;
  admin_id?: number;
  admin?: string; // Define as an object, not a string
  created_at?: Date | string;
}

// Define interfaces for nested objects
export interface User {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
}

export interface Client {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  addresses?: Address[]; // Define as an array of Address objects
}

export interface OrderItem {
  id?: number;
  product_id?: number;
  product?: Product; // Define as an object, not a string
  quantity?: number;
  total?: number;
  order_id?: number;
  created_at?: Date | string;
}

export interface Product {
  id?: number;
  title?: string;
  description?: string;
  stock?: number;
  priceBeforeDiscount?: number;
  discount?: number;
  priceAfterDiscount?: number;
  category?: string;
  productImages?: ProductImage[]; // Define as an array of ProductImage objects
  productReviews?: ProductReview[]; // Define as an array of ProductReview objects
  admin?: string;
  admin_id?: number;
  created_at?: Date | string;
}

export interface ProductImage {
  id?: number;
  created_at?: Date | string;
  updated_at?: Date | string;
  product_id?: number;
  image?: string;
}

export interface ProductReview {
  id?: number;
  created_at?: Date | string;
  updated_at?: Date | string;
  product_id?: number;
  client_id?: number | null;
  admin_id?: number | null;
  user_id?: number | null;
  review?: string;
  rating?: number;
  status?: string;
  deleted_at?: Date | string | null;
}

export interface Address {
  id?: number;
  address?: string;
  country?: string;
  country_id?: number;
  city?: string;
  city_id?: number;
  user_id?: number | null;
  user?: User; // Define as a string or User object
  client_id?: number;
  client?: Client; // Define as a string or Client object
  created_at?: Date | string | null;
}