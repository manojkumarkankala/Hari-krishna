import { GraduationCap, MapPin } from 'lucide-react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { ScrollReveal } from '@/components/ScrollReveal';

export function Education() {
  const { education } = usePortfolio();
  const publishedEducation = education.filter((e) => e.is_published);

  return (
    <section id="education" className="py-20 lg:py-28 bg-white dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="text-blue-600 dark:text-blue-400">Education</span>
          </h2>
          <div className="w-20 h-1 bg-blue-600 dark:bg-blue-400 rounded-full mx-auto" />
        </ScrollReveal>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-blue-500 to-cyan-500 -translate-x-1/2" />

          {publishedEducation.map((edu, index) => {
            const isLeft = index % 2 === 0;
            return (
              <ScrollReveal
                key={edu.id}
                animation={isLeft ? 'slide-right' : 'slide-left'}
                delay={index * 100}
                className={`relative mb-8 sm:mb-12 flex ${isLeft ? 'sm:justify-start' : 'sm:justify-end'}`}
              >
                {/* Dot on timeline */}
                <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 z-10">
                  <div className="w-4 h-4 rounded-full bg-blue-600 dark:bg-blue-400 border-4 border-white dark:border-gray-900 shadow-lg" />
                </div>

                {/* Card */}
                <div className={`ml-12 sm:ml-0 sm:w-[calc(50%-2rem)] ${isLeft ? '' : ''}`}>
                  <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {edu.institution_image_url ? (
                          <img
                            src={edu.institution_image_url}
                            alt={edu.institution}
                            className="w-14 h-14 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                            <GraduationCap size={28} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-snug">
                          {edu.degree}
                        </h3>
                        <p className="text-blue-600 dark:text-blue-400 font-medium mt-1">
                          {edu.institution}
                        </p>
                        {edu.location && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                            <MapPin size={14} />
                            {edu.location}
                          </p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-3">
                          {edu.score_value && (
                            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-sm font-semibold">
                              {edu.score_label}: {edu.score_value}
                            </span>
                          )}
                          {(edu.start_year || edu.end_year) && (
                            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm">
                              {edu.start_year}{edu.start_year && edu.end_year ? ' - ' : ''}{edu.end_year}
                            </span>
                          )}
                        </div>
                        {edu.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
