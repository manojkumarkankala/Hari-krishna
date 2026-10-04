import { Trophy, Calendar } from 'lucide-react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { ScrollReveal } from '@/components/ScrollReveal';

export function Achievements() {
  const { achievements } = usePortfolio();
  const published = achievements.filter((a) => a.is_published);

  return (
    <section id="achievements" className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="text-blue-600 dark:text-blue-400">Achievements</span>
          </h2>
          <div className="w-20 h-1 bg-blue-600 dark:bg-blue-400 rounded-full mx-auto" />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {published.map((achievement, index) => (
            <ScrollReveal key={achievement.id} delay={index * 100}>
              <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-500" />

                <div className="relative flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Trophy size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-snug mb-1">
                      {achievement.title}
                    </h3>
                    {achievement.organization && (
                      <p className="text-amber-600 dark:text-amber-400 text-sm font-medium mb-2">
                        {achievement.organization}
                      </p>
                    )}
                    {achievement.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {achievement.description}
                      </p>
                    )}
                    {achievement.date && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1">
                        <Calendar size={12} />
                        {achievement.date}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
