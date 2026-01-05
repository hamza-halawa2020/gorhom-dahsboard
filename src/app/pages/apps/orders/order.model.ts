export interface Order {
  id?: number;
  address?: string;
  
  client?: Client;
  shipment?: Shipment;
  coupon?: Coupon;
  items?: OrderItem[];
  total_amount?: number;
  discount_amount?: number;
  final_amount?: number;
  status?: string;
  payment_method?: string;
  status_changed_by?: User;
  created_at?: Date | string;
  updated_at?: Date | string;
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
}

export interface Shipment {
  id?: number;
  country?: { id: number; title: string };
  city?: { id: number; title: string };
  cost?: number;
}

export interface Coupon {
  id?: number;
  code?: string;
  type?: string;
  value?: number;
}

export interface OrderItem {
  id?: number;
  product_size_id?: number;
  product_size?: ProductSize;
  quantity?: number;
  price?: number;
  total?: number;
  created_at?: Date | string;
}

export interface ProductSize {
  id?: number;
  size?: string;
  price_before_discount?: number;
  discount?: number;
  price_after_discount?: number;
  stock?: number;
  product?: Product;
}

export interface Product {
  id?: number;
  title?: { [key: string]: string };
  description?: { [key: string]: string };
  image?: string;
  category?: { id: number; name: { [key: string]: string } };
  created_at?: Date | string;
}

export interface Address {
  id?: number;
  address?: string;
  country?: string;
  country_id?: number;
  city?: string;
  city_id?: number;
  created_at?: Date | string;
}