import { useState } from 'react';
import { Github, ExternalLink, Eye, X, Calendar, CheckCircle2, Circle } from 'lucide-react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { ScrollReveal } from '@/components/ScrollReveal';
import type { Project } from '@/lib/types';

export function Projects() {
  const { projects } = usePortfolio();
  const publishedProjects = projects.filter((p) => p.is_published);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            My <span className="text-blue-600 dark:text-blue-400">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-blue-600 dark:bg-blue-400 rounded-full mx-auto" />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8">
          {publishedProjects.map((project, index) => (
            <ScrollReveal key={project.id} delay={index * 100}>
              <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] h-full flex flex-col">
                {/* Project image */}
                <div className="relative h-56 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-gray-700 dark:to-gray-900 overflow-hidden">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-bold text-blue-300 dark:text-blue-700">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  {/* Status badge */}
                  <div className="absolute top-4 right-4">
                    {project.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-medium shadow-lg">
                        <CheckCircle2 size={12} />
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-medium shadow-lg">
                        <Circle size={12} />
                        In Progress
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {project.project_date && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 flex items-center gap-1">
                      <Calendar size={12} />
                      {project.project_date}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
                      >
                        <Github size={16} />
                        GitHub
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-100 dark:bg-cyan-950/40 hover:bg-cyan-200 dark:hover:bg-cyan-900 text-cyan-700 dark:text-cyan-400 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
                      >
                        <ExternalLink size={16} />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Project detail modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-gray-700 dark:to-gray-900">
              {selectedProject.image_url ? (
                <img src={selectedProject.image_url} alt={selectedProject.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-5xl font-bold text-blue-300 dark:text-blue-700">
                    {selectedProject.title.charAt(0)}
                  </span>
                </div>
              )}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-700 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{selectedProject.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{selectedProject.description}</p>

              {selectedProject.features.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Features</h4>
                  <ul className="space-y-1.5">
                    {selectedProject.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300 text-sm">
                        <CheckCircle2 size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedProject.technologies.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <span key={tech} className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-sm font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                {selectedProject.github_url && (
                  <a href={selectedProject.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-all">
                    <Github size={18} /> View Code
                  </a>
                )}
                {selectedProject.live_url && (
                  <a href={selectedProject.live_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all">
                    <ExternalLink size={18} /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
