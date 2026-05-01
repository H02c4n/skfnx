// ============================================
// Common paginated response wrapper
// ============================================
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ============================================
// Site settings
// ============================================
export interface SiteSettings {
  id: number;
  organization_name: string;
  org_number: string;
  logo: string | null;          // relative path or absolute URL
  hero_background: string | null;
  email: string;
  phone: string;
  address: string;
  website: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  founded_year: number | null;
  mission: string;              // already translated (backend sends current language)
  vision: string;
  short_description: string;
}

// ============================================
// Board member (from /api/board-members/)
// ============================================
export interface BoardMember {
  id: number;
  name: string;
  title: string;
  email: string;
  image: string;               // absolute Cloudinary URL
  order: number;
}

// ============================================
// Event – used in main events list and detail
// translations object contains all languages
// ============================================
export interface EventTranslation {
  title: string;
  description: string;
  location: string;
}

export interface Event {
  id: number;
  slug: string;
  image: string | null;        // absolute URL or null
  date_time: string;           // ISO with timezone
  price: number | null;
  capacity: number | null;
  created_at?: string;
  updated_at?: string;
  attendees_count?: number;
  available_spots?: number | null;
  is_free?: boolean;
  // Translations keyed by language code
  translations: {
    sv: EventTranslation;
    en: EventTranslation;
    tr: EventTranslation;
  };
  // Helper fields from serializers (optional)
  price_display?: string;
}

// ============================================
// Simplified event used in /events/upcoming/
// ============================================
export interface UpcomingEvent {
  id: number;
  title: string;               // direct title, already in current language
  slug: string;
  date_time: string;
  price_display: string;       // e.g. "245.00 SEK" or "Free"
  image?: string | null;       // may not be present in all responses
}

// ============================================
// Calendar event (grouped by date)
// ============================================
export interface CalendarEvent {
  id: number;
  title: string;               // already in current language
  slug: string;
  time: string;                // HH:MM
  price: string;               // "Free" or "XXX SEK"
}

// ============================================
// Blog post – translations are language‑keyed
// ============================================
export interface PostTranslation {
  title: string;
  content: string;             // HTML content
}

export interface PostCategory {
  id: number;
  name: string;                // not translated (e.g. "news", "events")
  slug: string;
}

export interface PostTag {
  id: number;
  slug: string;
  translations: {
    sv: { name: string };
    en: { name: string };
    tr: { name: string };
  };
}

export interface Post {
  id: number;
  slug: string;
  image: string | null;        // absolute URL
  category: PostCategory;
  tags: PostTag[];
  created_at: string;
  updated_at?: string;
  translations: {
    sv: PostTranslation;
    en: PostTranslation;
    tr: PostTranslation;
  };
}

// ============================================
// User (from /api/me/)
// ============================================
export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: 'member' | 'volunteer' | 'admin';
  is_volunteer: boolean;
  is_active: boolean;
  bio?: string;
  phone?: string;
  date_joined: string;
  // Optional extended fields
  cancellation_requests?: { id: number; status: 'pending' | 'approved' | 'rejected' }[];
}