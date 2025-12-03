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

export interface Client {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  addresses?: Address[];
  created_at?: Date | string;
}
