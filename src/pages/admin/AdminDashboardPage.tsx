import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { DashboardOverview } from '@/pages/admin/DashboardOverview';
import { ProfileManager } from '@/pages/admin/ProfileManager';
import { AboutManager } from '@/pages/admin/AboutManager';
import { SkillsManager } from '@/pages/admin/SkillsManager';
import { EducationManager } from '@/pages/admin/EducationManager';
import { ProjectsManager } from '@/pages/admin/ProjectsManager';
import { CertificatesManager } from '@/pages/admin/CertificatesManager';
import { AchievementsManager } from '@/pages/admin/AchievementsManager';
import { SocialLinksManager } from '@/pages/admin/SocialLinksManager';
import { ResumeManager } from '@/pages/admin/ResumeManager';
import { MessagesManager } from '@/pages/admin/MessagesManager';
import { WebsiteSettingsManager } from '@/pages/admin/WebsiteSettingsManager';
import { SeoSettingsManager } from '@/pages/admin/SeoSettingsManager';
import { ImagesManager } from '@/pages/admin/ImagesManager';
import { VideosManager } from '@/pages/admin/VideosManager';
import { LocationsManager } from '@/pages/admin/LocationsManager';
import { AdminAccountManager } from '@/pages/admin/AdminAccountManager';

export function AdminDashboardPage() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/profile" element={<ProfileManager />} />
        <Route path="/about" element={<AboutManager />} />
        <Route path="/skills" element={<SkillsManager />} />
        <Route path="/education" element={<EducationManager />} />
        <Route path="/projects" element={<ProjectsManager />} />
        <Route path="/certificates" element={<CertificatesManager />} />
        <Route path="/achievements" element={<AchievementsManager />} />
        <Route path="/social" element={<SocialLinksManager />} />
        <Route path="/resume" element={<ResumeManager />} />
        <Route path="/messages" element={<MessagesManager />} />
        <Route path="/settings" element={<WebsiteSettingsManager />} />
        <Route path="/seo" element={<SeoSettingsManager />} />
        <Route path="/images" element={<ImagesManager />} />
        <Route path="/videos" element={<VideosManager />} />
        <Route path="/locations" element={<LocationsManager />} />
        <Route path="/account" element={<AdminAccountManager />} />
      </Routes>
    </AdminLayout>
  );
}
