import { type ReactNode, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FileText,
  Code,
  GraduationCap,
  Briefcase,
  Award,
  Trophy,
  Link2,
  FileDown,
  Settings,
  Search,
  Image,
  Video,
  MapPin,
  LogOut,
  Menu,
  X,
  Shield,
  Moon,
  Sun,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

const menuItems = [
  { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Profile', path: '/admin/dashboard/profile', icon: User },
  { label: 'About', path: '/admin/dashboard/about', icon: FileText },
  { label: 'Skills', path: '/admin/dashboard/skills', icon: Code },
  { label: 'Education', path: '/admin/dashboard/education', icon: GraduationCap },
  { label: 'Projects', path: '/admin/dashboard/projects', icon: Briefcase },
  { label: 'Certificates', path: '/admin/dashboard/certificates', icon: Award },
  { label: 'Achievements', path: '/admin/dashboard/achievements', icon: Trophy },
  { label: 'Social Media', path: '/admin/dashboard/social', icon: Link2 },
  { label: 'Resume', path: '/admin/dashboard/resume', icon: FileDown },
  { label: 'Contact Messages', path: '/admin/dashboard/messages', icon: Settings },
  { label: 'Website Settings', path: '/admin/dashboard/settings', icon: Settings },
  { label: 'SEO Settings', path: '/admin/dashboard/seo', icon: Search },
  { label: 'Images', path: '/admin/dashboard/images', icon: Image },
  { label: 'Videos', path: '/admin/dashboard/videos', icon: Video },
  { label: 'Locations', path: '/admin/dashboard/locations', icon: MapPin },
  { label: 'Admin Account', path: '/admin/dashboard/account', icon: Shield },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar - desktop */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-gray-900 dark:bg-black border-r border-gray-800 transition-transform duration-300 overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6">
          <Link to="/admin/dashboard" className="flex items-center gap-2 text-white font-bold text-lg mb-8">
            <Shield size={24} className="text-blue-500" />
            Admin Panel
          </Link>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={handleSignOut}
            className="mt-8 w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/30 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link
              to="/"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              View Website
            </Link>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
