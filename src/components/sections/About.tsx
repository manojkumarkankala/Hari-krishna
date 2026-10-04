import { Target, BookOpen, Sparkles } from 'lucide-react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { ScrollReveal } from '@/components/ScrollReveal';

export function About() {
  const { profile, education } = usePortfolio();

  const publishedEducation = education.filter((e) => e.is_published);
  const skillsCount = 5;

  const stats = [
    { label: 'Education Entries', value: publishedEducation.length, icon: BookOpen },
    { label: 'Technical Skills', value: skillsCount, icon: Sparkles },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            About <span className="text-blue-600 dark:text-blue-400">Me</span>
          </h2>
          <div className="w-20 h-1 bg-blue-600 dark:bg-blue-400 rounded-full mx-auto" />
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Career objective */}
          <ScrollReveal className="lg:col-span-2" delay={100}>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl p-8 border border-blue-100 dark:border-gray-700 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-blue-600 text-white">
                  <Target size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Career Objective</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {profile?.career_objective}
              </p>
            </div>
          </ScrollReveal>

          {/* Quick info */}
          <ScrollReveal delay={200}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg h-full">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Info</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Name</span>
                  <p className="font-medium text-gray-900 dark:text-white">{profile?.full_name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
                  <p className="font-medium text-gray-900 dark:text-white break-all">{profile?.email}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Phone</span>
                  <p className="font-medium text-gray-900 dark:text-white">{profile?.phone}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Location</span>
                  <p className="font-medium text-gray-900 dark:text-white">{profile?.location}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Bio + technical interests */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <ScrollReveal delay={150}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg h-full">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Professional Introduction</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {profile?.short_bio || 'A Computer Science Engineering student with a focus on Artificial Intelligence and Machine Learning, building practical solutions with Python and Java.'}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={250}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg h-full">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Technical Interests</h3>
              <div className="flex flex-wrap gap-2">
                {['AI/ML', 'Python Development', 'Java Development', 'Data Science', 'Web Technologies', 'Software Engineering'].map((interest) => (
                  <span
                    key={interest}
                    className="px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-sm font-medium border border-blue-100 dark:border-blue-900"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Stats */}
        <ScrollReveal delay={200} className="mt-8">
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-center text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Icon className="mx-auto mb-2" size={28} />
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm opacity-90 mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
