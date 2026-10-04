import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowRight, Download, User } from 'lucide-react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { getIcon } from '@/lib/iconMap';

export function Hero() {
  const { profile, socialLinks, resume } = usePortfolio();

  const heading = profile?.hero_heading || 'Kumbam Hari Krishna Reddy';
  const subtitle = profile?.hero_subtitle || 'Computer Science Engineering | AI/ML | Python | Java Developer';
  const activeSocials = socialLinks.filter((s) => s.is_active && s.url);

  const scrollToProjects = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownloadResume = () => {
    if (resume?.file_url) {
      window.open(resume.file_url, '_blank');
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - text */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-sm font-medium">
              Welcome to my portfolio
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 leading-tight">
              {heading}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-xl mx-auto lg:mx-0">
              {subtitle}
            </p>
            {profile?.short_bio && (
              <p className="text-base text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {profile.short_bio}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
              <button
                onClick={scrollToProjects}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                View My Projects
                <ArrowRight size={18} />
              </button>
              <button
                onClick={handleDownloadResume}
                disabled={!resume?.file_url}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Download size={18} />
                Download Resume
              </button>
              <button
                onClick={scrollToContact}
                className="inline-flex items-center gap-2 px-6 py-3 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 font-medium rounded-xl transition-all duration-200 hover:scale-105"
              >
                <User size={18} />
                Contact Me
              </button>
            </div>

            {/* Social links */}
            {activeSocials.length > 0 && (
              <div className="flex gap-3 justify-center lg:justify-start">
                {activeSocials.map((social) => {
                  const Icon = getIcon(social.icon_name);
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 hover:scale-110 shadow-sm"
                      aria-label={social.platform}
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            )}

            {/* Quick contact info */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-1.5">
                <Mail size={16} className="text-blue-500" />
                {profile?.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone size={16} className="text-blue-500" />
                {profile?.phone}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={16} className="text-blue-500" />
                {profile?.location}
              </span>
            </div>
          </div>

          {/* Right - profile image */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-500 dark:to-cyan-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl">
                {profile?.profile_image_url ? (
                  <img
                    src={profile.profile_image_url}
                    alt={profile?.full_name || 'Profile'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                    <span className="text-7xl font-bold text-blue-600 dark:text-blue-400">
                      {profile?.full_name?.charAt(0) || 'K'}
                    </span>
                  </div>
                )}
              </div>
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-300 dark:border-blue-700 animate-spin-slow" style={{ animationDuration: '20s' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
