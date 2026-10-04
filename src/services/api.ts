import { supabase } from '@/lib/supabase';
import type {
  Profile,
  Skill,
  Education,
  Project,
  Certificate,
  Achievement,
  SocialLink,
  ContactMessage,
  WebsiteSettings,
  SeoSettings,
  MediaItem,
  VideoItem,
  LocationItem,
  ResumeItem,
} from '@/lib/types';

export async function fetchProfile(): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').maybeSingle();
  if (error) throw error;
  return data as Profile | null;
}

export async function fetchSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return (data as Skill[]) || [];
}

export async function fetchEducation(): Promise<Education[]> {
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return (data as Education[]) || [];
}

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return (data as Project[]) || [];
}

export async function fetchCertificates(): Promise<Certificate[]> {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return (data as Certificate[]) || [];
}

export async function fetchAchievements(): Promise<Achievement[]> {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return (data as Achievement[]) || [];
}

export async function fetchSocialLinks(): Promise<SocialLink[]> {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return (data as SocialLink[]) || [];
}

export async function fetchWebsiteSettings(): Promise<WebsiteSettings | null> {
  const { data, error } = await supabase.from('website_settings').select('*').maybeSingle();
  if (error) throw error;
  return data as WebsiteSettings | null;
}

export async function fetchSeoSettings(): Promise<SeoSettings | null> {
  const { data, error } = await supabase.from('seo_settings').select('*').maybeSingle();
  if (error) throw error;
  return data as SeoSettings | null;
}

export async function fetchResume(): Promise<ResumeItem | null> {
  const { data, error } = await supabase.from('resume').select('*').order('uploaded_at', { ascending: false }).limit(1).maybeSingle();
  if (error) throw error;
  return data as ResumeItem | null;
}

export async function fetchLocations(): Promise<LocationItem[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data as LocationItem[]) || [];
}

export async function fetchVideos(): Promise<VideoItem[]> {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return (data as VideoItem[]) || [];
}

export async function fetchMedia(): Promise<MediaItem[]> {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as MediaItem[]) || [];
}

export async function fetchMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as ContactMessage[]) || [];
}

export async function submitContactMessage(msg: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): Promise<void> {
  const { error } = await supabase.from('contact_messages').insert(msg);
  if (error) throw error;
}
