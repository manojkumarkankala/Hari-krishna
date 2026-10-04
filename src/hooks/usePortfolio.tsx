import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { PortfolioData } from '@/lib/types';
import {
  fetchProfile,
  fetchSkills,
  fetchEducation,
  fetchProjects,
  fetchCertificates,
  fetchAchievements,
  fetchSocialLinks,
  fetchWebsiteSettings,
  fetchSeoSettings,
  fetchResume,
  fetchLocations,
  fetchVideos,
} from '@/services/api';

interface PortfolioContextValue extends PortfolioData {
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const defaultData: PortfolioData = {
  profile: null,
  skills: [],
  education: [],
  projects: [],
  certificates: [],
  achievements: [],
  socialLinks: [],
  settings: null,
  seo: null,
  resume: null,
  locations: [],
  videos: [],
};

const PortfolioContext = createContext<PortfolioContextValue | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setError(null);
      const [
        profile,
        skills,
        education,
        projects,
        certificates,
        achievements,
        socialLinks,
        settings,
        seo,
        resume,
        locations,
        videos,
      ] = await Promise.all([
        fetchProfile(),
        fetchSkills(),
        fetchEducation(),
        fetchProjects(),
        fetchCertificates(),
        fetchAchievements(),
        fetchSocialLinks(),
        fetchWebsiteSettings(),
        fetchSeoSettings(),
        fetchResume(),
        fetchLocations(),
        fetchVideos(),
      ]);

      setData({
        profile,
        skills,
        education,
        projects,
        certificates,
        achievements,
        socialLinks,
        settings,
        seo,
        resume,
        locations,
        videos,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <PortfolioContext.Provider value={{ ...data, loading, error, refresh }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
}
