export interface AdminUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  bio: string | null;
  area_of_expertise: string | null;
  picture: string | null;
  is_influencer: boolean;
  is_verified: boolean;
  username: string;
  id_card_face: string | null;
  id_card_back: string | null;
}
