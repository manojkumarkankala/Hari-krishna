import { useEffect, useState } from 'react';
import { Briefcase, Award, Code, Mail, Trophy, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { usePortfolio } from '@/hooks/usePortfolio';

interface DashboardStats {
  totalProjects: number;
  totalCertificates: number;
  totalSkills: number;
  totalMessages: number;
  unreadMessages: number;
  totalAchievements: number;
}

interface RecentMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  created_at: string;
  is_read: boolean;
}

export function DashboardOverview() {
  const { projects, certificates, skills, achievements } = usePortfolio();
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalCertificates: 0,
    totalSkills: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalAchievements: 0,
  });
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const { count: totalMessages } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true });

      const { count: unreadMessages } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);

      const { data: messages } = await supabase
        .from('contact_messages')
        .select('id, name, email, subject, created_at, is_read')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalProjects: projects.length,
        totalCertificates: certificates.length,
        totalSkills: skills.length,
        totalMessages: totalMessages || 0,
        unreadMessages: unreadMessages || 0,
        totalAchievements: achievements.length,
      });
      setRecentMessages((messages as RecentMessage[]) || []);
      setLoading(false);
    }
    loadStats();
  }, [projects.length, certificates.length, skills.length, achievements.length]);

  const statCards = [
    { label: 'Total Projects', value: stats.totalProjects, icon: Briefcase, path: '/admin/dashboard/projects', color: 'from-blue-500 to-indigo-500' },
    { label: 'Total Certificates', value: stats.totalCertificates, icon: Award, path: '/admin/dashboard/certificates', color: 'from-cyan-500 to-teal-500' },
    { label: 'Total Skills', value: stats.totalSkills, icon: Code, path: '/admin/dashboard/skills', color: 'from-orange-500 to-amber-500' },
    { label: 'Total Messages', value: stats.totalMessages, icon: Mail, path: '/admin/dashboard/messages', color: 'from-green-500 to-emerald-500' },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: TrendingUp, path: '/admin/dashboard/messages', color: 'from-red-500 to-rose-500' },
    { label: 'Total Achievements', value: stats.totalAchievements, icon: Trophy, path: '/admin/dashboard/achievements', color: 'from-purple-500 to-fuchsia-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-200 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Dashboard Overview</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Welcome back! Here's a summary of your portfolio.</p>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              to={stat.path}
              className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
            </Link>
          );
        })}
      </div>

      {/* Recent messages */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock size={20} className="text-blue-500" />
            Recent Messages
          </h2>
          <Link to="/admin/dashboard/messages" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View all
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm py-8 text-center">No messages yet.</p>
        ) : (
          <div className="space-y-3">
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-700 transition-all"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">{msg.name}</span>
                    {!msg.is_read && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{msg.subject || msg.email}</p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 ml-3">
                  {new Date(msg.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
