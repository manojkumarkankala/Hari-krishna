import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { getIcon } from '@/lib/iconMap';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Education', href: '#education' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact', href: '#contact' },
];

export function Footer() {
  const { profile, socialLinks, settings } = usePortfolio();
  const activeSocials = socialLinks.filter((s) => s.is_active && s.url);
  const year = new Date().getFullYear();
  const copyrightText = settings?.copyright_text || 'Kumbam Hari Krishna Reddy. All Rights Reserved.';

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3">
              {profile?.full_name || 'Kumbam Hari Krishna Reddy'}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {settings?.footer_text || profile?.short_bio || 'Computer Science Engineering student passionate about AI/ML, Python, and Java development.'}
            </p>
            {activeSocials.length > 0 && (
              <div className="flex gap-3">
                {activeSocials.map((social) => {
                  const Icon = getIcon(social.icon_name);
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white transition-all duration-200"
                      aria-label={social.platform}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors text-left"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <div className="space-y-2 text-sm">
              <a href={`mailto:${profile?.email}`} className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors break-all">
                <Mail size={16} className="flex-shrink-0" />
                {profile?.email}
              </a>
              <a href={`tel:${profile?.phone}`} className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                <Phone size={16} className="flex-shrink-0" />
                {profile?.phone}
              </a>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={16} className="flex-shrink-0" />
                {profile?.location}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {year} {copyrightText}
          </p>
          <div className="flex items-center gap-4">
            <Link to="/admin/login" className="text-sm text-gray-500 hover:text-blue-400 transition-colors">
              Admin
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2 rounded-lg bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white transition-all duration-200"
              aria-label="Back to top"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
