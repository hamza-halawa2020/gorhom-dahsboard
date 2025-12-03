export interface Shipment {
  id?: number;
  country_id?: number;
  city_id?: number;
  cost?: string;
  country?: string;
  city?: string;
  created_at?: Date | string;
}
