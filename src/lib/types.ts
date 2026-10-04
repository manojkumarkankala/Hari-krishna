export interface Profile {
  id: string;
  full_name: string;
  professional_title: string;
  email: string;
  phone: string;
  location: string;
  career_objective: string;
  short_bio: string;
  profile_image_url: string;
  hero_heading: string;
  hero_subtitle: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon_name: string;
  proficiency: number;
  display_order: number;
  is_published: boolean;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  score_label: string;
  score_value: string;
  start_year: string;
  end_year: string;
  description: string;
  institution_image_url: string;
  display_order: number;
  is_published: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  features: string[];
  image_url: string;
  video_url: string;
  github_url: string;
  live_url: string;
  project_date: string;
  status: string;
  display_order: number;
  is_published: boolean;
}

export interface Certificate {
  id: string;
  name: string;
  issuing_organization: string;
  issue_date: string;
  description: string;
  image_url: string;
  pdf_url: string;
  certificate_url: string;
  display_order: number;
  is_published: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  organization: string;
  date: string;
  display_order: number;
  is_published: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon_name: string;
  is_active: boolean;
  display_order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface WebsiteSettings {
  id: string;
  website_title: string;
  website_description: string;
  logo_url: string;
  favicon_url: string;
  primary_color: string;
  secondary_color: string;
  hero_heading: string;
  hero_subtitle: string;
  footer_text: string;
  copyright_text: string;
  contact_email: string;
  contact_phone: string;
  google_analytics_id: string;
  google_search_console: string;
  social_sharing_image: string;
  dark_mode_default: boolean;
}

export interface SeoSettings {
  id: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_card: string;
  canonical_url: string;
  robots: string;
  json_ld: Record<string, unknown>;
}

export interface MediaItem {
  id: string;
  title: string;
  file_url: string;
  file_type: string;
  file_size: number;
  alt_text: string;
  category: string;
  created_at: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  video_url: string;
  youtube_url: string;
  thumbnail_url: string;
  is_enabled: boolean;
  display_order: number;
}

export interface LocationItem {
  id: string;
  label: string;
  address: string;
  city: string;
  state: string;
  country: string;
  google_maps_url: string;
  latitude: string;
  longitude: string;
  is_public: boolean;
}

export interface ResumeItem {
  id: string;
  file_url: string;
  filename: string;
  file_size: number;
  uploaded_at: string;
}

export interface PortfolioData {
  profile: Profile | null;
  skills: Skill[];
  education: Education[];
  projects: Project[];
  certificates: Certificate[];
  achievements: Achievement[];
  socialLinks: SocialLink[];
  settings: WebsiteSettings | null;
  seo: SeoSettings | null;
  resume: ResumeItem | null;
  locations: LocationItem[];
  videos: VideoItem[];
}
