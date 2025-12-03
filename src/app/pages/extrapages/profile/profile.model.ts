export interface Profile {
  id: number;
  name: string;
  slug: string;
  phone: string;
  email: string;
  type?: string;
  image?: string;
  email_verified_at?: Date;
  created_at?: Date;
}
