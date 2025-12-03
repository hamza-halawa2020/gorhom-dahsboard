export interface Addrees {
  id?: number;
  country_id?: number;
  city_id?: number;
  user_id?: number;
  client_id?: number;
  country?: string;
  city?: string;
  user?: User;
  client?: Client;
  address?: string;
  created_at?: Date | string;
}


export interface Client {
  id?: number;
   name?: string;
   email?: string;
   phone?: string;
   created_at?: Date | string;
}

export interface User {
  id?: number;
   name?: string;
   email?: string;
   phone?: string;
   created_at?: Date | string;
}
