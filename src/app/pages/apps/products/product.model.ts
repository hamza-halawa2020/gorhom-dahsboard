export interface ProductSize {
  id?: number;
  size?: string;
  price_before_discount?: number;
  discount?: number | null;
  price_after_discount?: number;
  stock?: number;
  created_at?: string;
  deleted_at?: string;
}

export interface Product {
  id?: number;
  title?: { [key: string]: string };     
  description?: { [key: string]: string }; 
  slug?: string;
  image?: string;
  files?: { id: number; path: string }[];
  sizes?: ProductSize[];
  category_id?: number;
  category?: { id: number; name: { [key: string]: string } };
  createdBy?: { id: number; name: string };
  reviews?: any[];
  views?: any[];
  created_at?: string;
  deleted_at?: string;
}