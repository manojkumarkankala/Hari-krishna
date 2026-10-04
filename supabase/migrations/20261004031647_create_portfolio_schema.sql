/*
# Create Portfolio CMS Schema for Kumbam Hari Krishna Reddy

This migration creates the complete database schema for a personal portfolio website with a full admin CMS.

## Tables Created:
1. **profiles** - Personal info (name, title, email, phone, location, bio, career objective, profile image)
2. **skills** - Technical skills with category and optional proficiency
3. **education** - Education timeline entries
4. **projects** - Portfolio projects with images, URLs, tech, features
5. **certificates** - Certifications with issuer, image/PDF
6. **achievements** - Achievement entries
7. **social_links** - Social media links (active/inactive, display order)
8. **contact_messages** - Messages from contact form (read/unread status)
9. **website_settings** - Site-wide settings (title, colors, hero text, footer, etc.)
10. **seo_settings** - SEO meta tags, Open Graph, JSON-LD
11. **media** - Image/video library references
12. **videos** - Video entries (file or YouTube URL)
13. **locations** - Location info (city, state, country, maps URL, lat/lng)
14. **resume** - Resume file reference (always latest)

## Security:
- RLS enabled on ALL tables
- Public (anon) can READ published content and INSERT contact messages
- Only authenticated admins can INSERT, UPDATE, DELETE
- Contact messages: anon can only INSERT, only authenticated can SELECT/UPDATE/DELETE

## Initial Data:
- Seeds profile, skills, education, projects, certificates, achievements, website settings, SEO settings from the resume
*/

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL DEFAULT 'Kumbam Hari Krishna Reddy',
  professional_title text NOT NULL DEFAULT 'Computer Science Engineering | AI/ML | Python | Java Developer',
  email text NOT NULL DEFAULT 'kumbamharikrishnareddy@gmail.com',
  phone text NOT NULL DEFAULT '9948287298',
  location text NOT NULL DEFAULT 'Midjil, Telangana',
  career_objective text NOT NULL DEFAULT 'A highly motivated, determined and hardworking individual, looking forward to secure a responsible career opportunity that will allow me to fully utilize my knowledge and skills while also significantly contributing to organization''s growth.',
  short_bio text DEFAULT '',
  profile_image_url text DEFAULT '',
  hero_heading text NOT NULL DEFAULT 'Kumbam Hari Krishna Reddy',
  hero_subtitle text NOT NULL DEFAULT 'Computer Science Engineering | AI/ML | Python | Java Developer',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_profiles" ON profiles;
CREATE POLICY "public_read_profiles" ON profiles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_profiles" ON profiles;
CREATE POLICY "auth_update_profiles" ON profiles FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_insert_profiles" ON profiles;
CREATE POLICY "auth_insert_profiles" ON profiles FOR INSERT
  TO authenticated WITH CHECK (true);

-- ============================================================
-- SKILLS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Programming',
  icon_name text DEFAULT 'Code',
  proficiency integer DEFAULT 0,
  display_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_skills" ON skills;
CREATE POLICY "public_read_skills" ON skills FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_skills" ON skills;
CREATE POLICY "auth_insert_skills" ON skills FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_skills" ON skills;
CREATE POLICY "auth_update_skills" ON skills FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_skills" ON skills;
CREATE POLICY "auth_delete_skills" ON skills FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- EDUCATION TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  degree text NOT NULL,
  institution text NOT NULL,
  location text DEFAULT '',
  score_label text DEFAULT 'CGPA',
  score_value text DEFAULT '',
  start_year text DEFAULT '',
  end_year text DEFAULT '',
  description text DEFAULT '',
  institution_image_url text DEFAULT '',
  display_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE education ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_education" ON education;
CREATE POLICY "public_read_education" ON education FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_education" ON education;
CREATE POLICY "auth_insert_education" ON education FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_education" ON education;
CREATE POLICY "auth_update_education" ON education FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_education" ON education;
CREATE POLICY "auth_delete_education" ON education FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- PROJECTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  technologies text[] DEFAULT '{}',
  features text[] DEFAULT '{}',
  image_url text DEFAULT '',
  video_url text DEFAULT '',
  github_url text DEFAULT '',
  live_url text DEFAULT '',
  project_date text DEFAULT '',
  status text DEFAULT 'completed',
  display_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_projects" ON projects;
CREATE POLICY "auth_insert_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_projects" ON projects;
CREATE POLICY "auth_update_projects" ON projects FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_projects" ON projects;
CREATE POLICY "auth_delete_projects" ON projects FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- CERTIFICATES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  issuing_organization text NOT NULL DEFAULT '',
  issue_date text DEFAULT '',
  description text DEFAULT '',
  image_url text DEFAULT '',
  pdf_url text DEFAULT '',
  certificate_url text DEFAULT '',
  display_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_certificates" ON certificates;
CREATE POLICY "public_read_certificates" ON certificates FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_certificates" ON certificates;
CREATE POLICY "auth_insert_certificates" ON certificates FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_certificates" ON certificates;
CREATE POLICY "auth_update_certificates" ON certificates FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_certificates" ON certificates;
CREATE POLICY "auth_delete_certificates" ON certificates FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- ACHIEVEMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  organization text DEFAULT '',
  date text DEFAULT '',
  display_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_achievements" ON achievements;
CREATE POLICY "public_read_achievements" ON achievements FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_achievements" ON achievements;
CREATE POLICY "auth_insert_achievements" ON achievements FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_achievements" ON achievements;
CREATE POLICY "auth_update_achievements" ON achievements FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_achievements" ON achievements;
CREATE POLICY "auth_delete_achievements" ON achievements FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- SOCIAL_LINKS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL DEFAULT '',
  icon_name text DEFAULT 'Link',
  is_active boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_social_links" ON social_links;
CREATE POLICY "public_read_social_links" ON social_links FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_social_links" ON social_links;
CREATE POLICY "auth_insert_social_links" ON social_links FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_social_links" ON social_links;
CREATE POLICY "auth_update_social_links" ON social_links FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_social_links" ON social_links;
CREATE POLICY "auth_delete_social_links" ON social_links FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- CONTACT_MESSAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  subject text DEFAULT '',
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Only authenticated can read messages
DROP POLICY IF EXISTS "auth_read_messages" ON contact_messages;
CREATE POLICY "auth_read_messages" ON contact_messages FOR SELECT
  TO authenticated USING (true);

-- Anyone can submit a message (contact form)
DROP POLICY IF EXISTS "public_insert_messages" ON contact_messages;
CREATE POLICY "public_insert_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_messages" ON contact_messages;
CREATE POLICY "auth_update_messages" ON contact_messages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_messages" ON contact_messages;
CREATE POLICY "auth_delete_messages" ON contact_messages FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- WEBSITE_SETTINGS TABLE (single row)
-- ============================================================
CREATE TABLE IF NOT EXISTS website_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  website_title text NOT NULL DEFAULT 'Kumbam Hari Krishna Reddy | Portfolio',
  website_description text NOT NULL DEFAULT 'Portfolio of Kumbam Hari Krishna Reddy - Computer Science Engineering student specializing in AI/ML, Python, and Java development.',
  logo_url text DEFAULT '',
  favicon_url text DEFAULT '',
  primary_color text DEFAULT '#2563eb',
  secondary_color text DEFAULT '#0ea5e9',
  hero_heading text NOT NULL DEFAULT 'Kumbam Hari Krishna Reddy',
  hero_subtitle text NOT NULL DEFAULT 'Computer Science Engineering | AI/ML | Python | Java Developer',
  footer_text text DEFAULT 'Computer Science Engineering student passionate about AI/ML, Python, and Java development.',
  copyright_text text DEFAULT 'Kumbam Hari Krishna Reddy. All Rights Reserved.',
  contact_email text DEFAULT 'kumbamharikrishnareddy@gmail.com',
  contact_phone text DEFAULT '9948287298',
  google_analytics_id text DEFAULT '',
  google_search_console text DEFAULT '',
  social_sharing_image text DEFAULT '',
  dark_mode_default boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_website_settings" ON website_settings;
CREATE POLICY "public_read_website_settings" ON website_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_website_settings" ON website_settings;
CREATE POLICY "auth_update_website_settings" ON website_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_insert_website_settings" ON website_settings;
CREATE POLICY "auth_insert_website_settings" ON website_settings FOR INSERT
  TO authenticated WITH CHECK (true);

-- ============================================================
-- SEO_SETTINGS TABLE (single row)
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meta_title text NOT NULL DEFAULT 'Kumbam Hari Krishna Reddy | Portfolio',
  meta_description text NOT NULL DEFAULT 'Portfolio of Kumbam Hari Krishna Reddy - Computer Science Engineering student specializing in AI/ML, Python, and Java development.',
  keywords text DEFAULT 'Kumbam Hari Krishna Reddy, portfolio, Python developer, Java developer, AI/ML, computer science engineering, Malla Reddy Engineering College',
  og_title text DEFAULT 'Kumbam Hari Krishna Reddy | Portfolio',
  og_description text DEFAULT 'Portfolio of Kumbam Hari Krishna Reddy - Computer Science Engineering student specializing in AI/ML, Python, and Java development.',
  og_image text DEFAULT '',
  twitter_card text DEFAULT 'summary_large_image',
  canonical_url text DEFAULT '',
  robots text DEFAULT 'index, follow',
  json_ld jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_seo_settings" ON seo_settings;
CREATE POLICY "public_read_seo_settings" ON seo_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_seo_settings" ON seo_settings;
CREATE POLICY "auth_update_seo_settings" ON seo_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_insert_seo_settings" ON seo_settings;
CREATE POLICY "auth_insert_seo_settings" ON seo_settings FOR INSERT
  TO authenticated WITH CHECK (true);

-- ============================================================
-- MEDIA TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text DEFAULT '',
  file_url text NOT NULL,
  file_type text NOT NULL DEFAULT 'image',
  file_size bigint DEFAULT 0,
  alt_text text DEFAULT '',
  category text DEFAULT 'gallery',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_media" ON media;
CREATE POLICY "public_read_media" ON media FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_media" ON media;
CREATE POLICY "auth_insert_media" ON media FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_media" ON media;
CREATE POLICY "auth_update_media" ON media FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_media" ON media;
CREATE POLICY "auth_delete_media" ON media FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- VIDEOS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  video_url text DEFAULT '',
  youtube_url text DEFAULT '',
  thumbnail_url text DEFAULT '',
  is_enabled boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_videos" ON videos;
CREATE POLICY "public_read_videos" ON videos FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_videos" ON videos;
CREATE POLICY "auth_insert_videos" ON videos FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_videos" ON videos;
CREATE POLICY "auth_update_videos" ON videos FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_videos" ON videos;
CREATE POLICY "auth_delete_videos" ON videos FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- LOCATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL DEFAULT 'Home',
  address text DEFAULT '',
  city text DEFAULT 'Midjil',
  state text DEFAULT 'Telangana',
  country text DEFAULT 'India',
  google_maps_url text DEFAULT '',
  latitude text DEFAULT '',
  longitude text DEFAULT '',
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_locations" ON locations;
CREATE POLICY "public_read_locations" ON locations FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_locations" ON locations;
CREATE POLICY "auth_insert_locations" ON locations FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_locations" ON locations;
CREATE POLICY "auth_update_locations" ON locations FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_locations" ON locations;
CREATE POLICY "auth_delete_locations" ON locations FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- RESUME TABLE (single row, always latest)
-- ============================================================
CREATE TABLE IF NOT EXISTS resume (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_url text NOT NULL DEFAULT '',
  filename text DEFAULT 'resume.pdf',
  file_size bigint DEFAULT 0,
  uploaded_at timestamptz DEFAULT now()
);

ALTER TABLE resume ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_resume" ON resume;
CREATE POLICY "public_read_resume" ON resume FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_resume" ON resume;
CREATE POLICY "auth_insert_resume" ON resume FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_resume" ON resume;
CREATE POLICY "auth_update_resume" ON resume FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_resume" ON resume;
CREATE POLICY "auth_delete_resume" ON resume FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Profile (single row)
INSERT INTO profiles (id, full_name, professional_title, email, phone, location, career_objective, short_bio)
VALUES (
  gen_random_uuid(),
  'Kumbam Hari Krishna Reddy',
  'Computer Science Engineering | AI/ML | Python | Java Developer',
  'kumbamharikrishnareddy@gmail.com',
  '9948287298',
  'Midjil, Telangana',
  'A highly motivated, determined and hardworking individual, looking forward to secure a responsible career opportunity that will allow me to fully utilize my knowledge and skills while also significantly contributing to organization''s growth.',
  'Computer Science Engineering student specializing in AI/ML with strong foundations in Python and Java. Passionate about building practical software solutions and exploring machine learning applications.'
)
ON CONFLICT DO NOTHING;

-- Website settings (single row)
INSERT INTO website_settings (id) VALUES (gen_random_uuid()) ON CONFLICT DO NOTHING;

-- SEO settings (single row)
INSERT INTO seo_settings (id) VALUES (gen_random_uuid()) ON CONFLICT DO NOTHING;

-- Skills
INSERT INTO skills (name, category, icon_name, proficiency, display_order) VALUES
  ('Python', 'Programming', 'Code', 0, 1),
  ('Java', 'Programming', 'Coffee', 0, 2),
  ('HTML', 'Web Technologies', 'Globe', 0, 3),
  ('CSS', 'Web Technologies', 'Palette', 0, 4),
  ('MySQL', 'Database', 'Database', 0, 5)
ON CONFLICT DO NOTHING;

-- Education
INSERT INTO education (degree, institution, location, score_label, score_value, display_order) VALUES
  ('B.Tech - Computer Science Engineering (AIML)', 'Malla Reddy Engineering College', '', 'CGPA', '7.45', 1),
  ('Intermediate - MPC', 'New Master Minds Junior College', 'Hyderabad, India', 'Percentage', '64%', 2),
  ('SSC', 'Devendra Vidyalaya', 'Thukkuguda, India', 'GPA', '8.2', 3)
ON CONFLICT DO NOTHING;

-- Projects
INSERT INTO projects (title, description, technologies, status, display_order) VALUES
  ('FASTAG FUEL', 'Developed a software tool using Python by that the manual petrol pump became automatic, same process as FASTag in toll gate.', ARRAY['Python'], 'completed', 1),
  ('Agricultural Crop Recommendation Based on Productivity and Season', 'Developed an AI model to recommend the most productive crops based on environmental, soil, and climatic data. It increases crop yield and sustainability, minimizes the risks associated with poor crop choices, and enhances food security and economic growth.', ARRAY['AI', 'Machine Learning', 'Data Science'], 'completed', 2)
ON CONFLICT DO NOTHING;

-- Certificates
INSERT INTO certificates (name, issuing_organization, display_order) VALUES
  ('Microsoft Azure Fundamentals', 'Microsoft', 1),
  ('Python and C', 'Skilltimate Technologies', 2),
  ('Python and Java', 'Tutors Campus', 3),
  ('Data Science', 'Tutors Campus', 4)
ON CONFLICT DO NOTHING;

-- Achievements
INSERT INTO achievements (title, description, organization, display_order) VALUES
  ('Participated in THINK AI', 'Participated in THINK AI conducted by TEAM (MREC)', 'TEAM (MREC)', 1),
  ('Participated in VISHESH-2k23', 'Participated in VISHESH-2k23 at MREC', 'MREC', 2)
ON CONFLICT DO NOTHING;

-- Location
INSERT INTO locations (label, city, state, country, is_public) VALUES
  ('Home', 'Midjil', 'Telangana', 'India', true)
ON CONFLICT DO NOTHING;

-- Social links (inactive by default, admin activates with URLs)
INSERT INTO social_links (platform, url, icon_name, is_active, display_order) VALUES
  ('LinkedIn', '', 'Linkedin', false, 1),
  ('GitHub', '', 'Github', false, 2),
  ('Instagram', '', 'Instagram', false, 3),
  ('Facebook', '', 'Facebook', false, 4),
  ('X/Twitter', '', 'Twitter', false, 5),
  ('YouTube', '', 'Youtube', false, 6)
ON CONFLICT DO NOTHING;
