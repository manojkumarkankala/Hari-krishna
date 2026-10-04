import { usePortfolio } from '@/hooks/usePortfolio';
import { AdminPageHeader, Card } from '@/components/admin/AdminUI';
import { Link } from 'react-router-dom';
import { FileText, ExternalLink } from 'lucide-react';

export function AboutManager() {
  const { profile } = usePortfolio();

  return (
    <div>
      <AdminPageHeader title="About Management" description="Manage your About section content" />

      <Card>
        <div className="flex items-start gap-3 mb-4">
          <FileText size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              The About section content (career objective, short bio, hero heading, hero subtitle) is managed from the Profile page.
            </p>
            <Link
              to="/admin/dashboard/profile"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm"
            >
              Go to Profile Management
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </Card>

      <div className="mt-6 space-y-4">
        <Card>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">Career Objective</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{profile?.career_objective}</p>
        </Card>
        <Card>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">Short Bio</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{profile?.short_bio || 'Not set yet.'}</p>
        </Card>
        <Card>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">Hero Heading</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{profile?.hero_heading}</p>
        </Card>
        <Card>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">Hero Subtitle</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{profile?.hero_subtitle}</p>
        </Card>
      </div>
    </div>
  );
}
