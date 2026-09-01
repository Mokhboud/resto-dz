export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  profile_photo?: string;
  status: string;
  email_verified: boolean;
  phone_verified: boolean;
  roles: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  phone?: string;
  address?: string;
  wilaya_id?: number;
  latitude?: string;
  longitude?: string;
  price_level?: number;
  status: string;
  verified: boolean;
  wilaya_name?: string;
  wilaya_name_ar?: string;
  avg_rating?: string;
  review_count?: string;
  ranking_score?: string;
  rank?: string;
}

export interface Category {
  id: string;
  name_fr: string;
  name_ar: string;
  name_en: string;
  icon?: string;
}

export interface Cuisine {
  id: string;
  name_fr: string;
  name_ar: string;
  name_en: string;
  icon?: string;
}

export interface Wilaya {
  id: number;
  code: string;
  name_fr: string;
  name_ar: string;
  name_en: string;
}

export interface Review {
  id: string;
  restaurant_id: string;
  overall_rating: string;
  comment?: string;
  status: string;
  created_at: string;
  reviewer_first_name?: string;
  reviewer_last_name?: string;
}

export interface OpeningHours {
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

export interface RestaurantDetail extends Restaurant {
  categories: Category[];
  cuisines: Cuisine[];
  opening_hours: OpeningHours[];
  photos: any[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  errorCode?: string;
}