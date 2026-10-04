import { Award, Download, ExternalLink, FileText } from 'lucide-react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { ScrollReveal } from '@/components/ScrollReveal';

export function Certificates() {
  const { certificates } = usePortfolio();
  const publishedCerts = certificates.filter((c) => c.is_published);

  return (
    <section id="certificates" className="py-20 lg:py-28 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="text-blue-600 dark:text-blue-400">Certificates</span>
          </h2>
          <div className="w-20 h-1 bg-blue-600 dark:bg-blue-400 rounded-full mx-auto" />
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {publishedCerts.map((cert, index) => (
            <ScrollReveal key={cert.id} delay={index * 100}>
              <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] h-full flex flex-col">
                {/* Certificate image */}
                <div className="relative h-40 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-gray-700 dark:to-gray-900 overflow-hidden">
                  {cert.image_url ? (
                    <img src={cert.image_url} alt={cert.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Award size={48} className="text-blue-300 dark:text-blue-700" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug mb-2">
                    {cert.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-1">
                    {cert.issuing_organization}
                  </p>
                  {cert.issue_date && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">{cert.issue_date}</p>
                  )}
                  {cert.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed line-clamp-2">
                      {cert.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {(cert.certificate_url || cert.image_url) && (
                      <a
                        href={cert.certificate_url || cert.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-all"
                      >
                        <ExternalLink size={14} />
                        View
                      </a>
                    )}
                    {cert.pdf_url && (
                      <a
                        href={cert.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-xs font-medium rounded-lg transition-all"
                      >
                        <Download size={14} />
                        PDF
                      </a>
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
