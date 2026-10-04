import { usePortfolio } from '@/hooks/usePortfolio';
import { getIcon } from '@/lib/iconMap';
import { ScrollReveal } from '@/components/ScrollReveal';

const categoryColors: Record<string, string> = {
  Programming: 'from-blue-500 to-indigo-500',
  'Web Technologies': 'from-cyan-500 to-teal-500',
  Database: 'from-orange-500 to-amber-500',
};

export function Skills() {
  const { skills } = usePortfolio();
  const publishedSkills = skills.filter((s) => s.is_published);
  const categories = [...new Set(publishedSkills.map((s) => s.category))];

  return (
    <section id="skills" className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            My <span className="text-blue-600 dark:text-blue-400">Skills</span>
          </h2>
          <div className="w-20 h-1 bg-blue-600 dark:bg-blue-400 rounded-full mx-auto" />
        </ScrollReveal>

        {categories.map((category, catIndex) => {
          const categorySkills = publishedSkills.filter((s) => s.category === category);
          const gradient = categoryColors[category] || 'from-blue-500 to-cyan-500';

          return (
            <ScrollReveal key={category} delay={catIndex * 100} className="mb-12 last:mb-0">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{category}</h3>
                <div className={`h-0.5 w-16 bg-gradient-to-r ${gradient} rounded-full mt-2`} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {categorySkills.map((skill) => {
                  const Icon = getIcon(skill.icon_name);
                  return (
                    <div
                      key={skill.id}
                      className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon size={28} />
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">{skill.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{skill.category}</p>
                      {skill.proficiency > 0 && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>Proficiency</span>
                            <span>{skill.proficiency}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
