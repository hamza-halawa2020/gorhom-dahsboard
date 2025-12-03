export interface Address {
  id?: number;
  address?: string;
  country_id?: number;
  country?: string;
  city_id?: number;
  city?: string;
  user_id?: number;
  client_id?: number;
  created_at?: Date | string;
}

export interface User {
  id?: number;
  name?: string;
  slug?: string;
  email?: string;
  image?: string;
  phone?: string;
  type?: string;
  addresses?: Address[];
  email_verified_at?: Date | string;
  created_at?: Date | string;
}
