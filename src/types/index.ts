export type TransactionType = 'sale' | 'rent' | 'lease';

export type PropertyType = 
  | 'villa' 
  | 'apartment' 
  | 'penthouse' 
  | 'house' 
  | 'commercial' 
  | 'plot';

export type ListingStatus = 'available' | 'under_contract' | 'sold' | 'rented';

export interface Agent {
  id: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  whatsapp: string;
  avatar: string;
  bio: string;
  languages: string[];
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  transaction_type: TransactionType;
  property_type: PropertyType;
  price: number;
  currency: string;
  rental_billing_period?: 'month' | 'year';
  address: string;
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  area_unit: string;
  amenities: string[];
  image_urls: string[];
  agent: Agent;
  listing_status: ListingStatus;
  featured_status: boolean;
  is_sample: boolean;
  floor_plan_url?: string;
  year_built: number;
  parking_spaces: number;
  hoa_fee?: number;
  tax_annual?: number;
  heating_cooling?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface PlanLimits {
  max_favorites: number;
  direct_agent_contact: boolean;
  priority_alerts: boolean;
  virtual_tours_unlocked: boolean;
  vip_concierge: boolean;
  listing_credits: number;
  advanced_market_data: boolean;
}

export interface MembershipPlan {
  id: string;
  slug: string;
  name: string;
  price: number; // in whole currency units (e.g. 99, 149, 199, 499)
  currency: string;
  billing_interval: 'one_time' | 'monthly' | 'yearly';
  tag?: string;
  description: string;
  is_popular?: boolean;
  features: string[];
  limits: PlanLimits;
  renewal_terms: string;
  cancellation_policy: string;
  eligibility: string;
}

export interface UserMembership {
  plan_id: string;
  plan_name: string;
  status: 'active' | 'canceled' | 'expired';
  started_at: string;
  expires_at: string | null;
  auto_renew: boolean;
  billing_interval: 'one_time' | 'monthly' | 'yearly';
  last_payment_id?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'agent' | 'admin';
  avatar?: string;
  created_at: string;
  membership: UserMembership;
  entitlements: PlanLimits;
  saved_property_ids: string[];
}

export interface Enquiry {
  id: string;
  property_id?: string;
  property_title?: string;
  user_id?: string;
  name: string;
  email: string;
  phone: string;
  category: 'general' | 'viewing' | 'offer' | 'valuation' | 'membership';
  preferred_contact: 'email' | 'phone' | 'whatsapp';
  message: string;
  status: 'pending' | 'reviewed' | 'contacted' | 'closed';
  notes?: string;
  created_at: string;
}

export interface ViewingRequest {
  id: string;
  property_id: string;
  property_title: string;
  user_id?: string;
  name: string;
  email: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  attendees: number;
  notes?: string;
  status: 'requested' | 'confirmed' | 'rescheduled' | 'completed';
  created_at: string;
}

export interface PaymentTransaction {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  plan_id: string;
  plan_name: string;
  amount: number;
  currency: string;
  billing_interval: string;
  payment_method: string;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  invoice_number: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  read_time: string;
  cover_image: string;
  tags: string[];
  published_at: string;
}

export interface SiteConfig {
  brand_name: string;
  tagline: string;
  contact_email: string;
  contact_phone: string;
  whatsapp_number: string;
  office_address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  currency: string;
  currency_symbol: string;
  social_links: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
}

export interface PropertyFilterParams {
  search?: string;
  transaction_type?: string;
  property_type?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
  amenities?: string[];
  featured?: boolean;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'area_desc';
  page?: number;
  limit?: number;
}

export interface SplashPrompt {
  id: string;
  category: 'hero' | 'villa' | 'penthouse' | 'apartment' | 'commercial' | 'interior' | 'agent';
  title: string;
  prompt: string;
  aspectRatio: '16:9' | '4:3' | '1:1';
  recommendedResolution: string;
}
