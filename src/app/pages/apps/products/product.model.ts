export interface Product {
  id?: number;
  title?: { [key: string]: string };     
  description?: { [key: string]: string }; 
  image?: string;
  files?: { id: number; path: string }[];
  stock?: boolean;
  price_before_discount?: number;
  discount?: number | null;
  price_after_discount?: number;
  category_id?: number;
  category?: { id: number; name: string };
  created_by?: number;
  created_by_name?: string;
  created_at?: string;
}