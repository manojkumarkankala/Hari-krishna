import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, User, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { submitContactMessage } from '@/services/api';
import { getIcon } from '@/lib/iconMap';
import { ScrollReveal } from '@/components/ScrollReveal';

export function Contact() {
  const { profile, socialLinks } = usePortfolio();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeSocials = socialLinks.filter((s) => s.is_active && s.url);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await submitContactMessage(form);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappNumber = profile?.phone?.replace(/\D/g, '');
  const whatsappUrl = whatsappNumber ? `https://wa.me/91${whatsappNumber}` : null;

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Get In <span className="text-blue-600 dark:text-blue-400">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-blue-600 dark:bg-blue-400 rounded-full mx-auto" />
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left - contact info */}
          <ScrollReveal animation="slide-right">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 text-white h-full">
              <h3 className="text-2xl font-bold mb-6">Let's Connect</h3>
              <p className="text-white/80 mb-8 leading-relaxed">
                Feel free to reach out for collaborations, opportunities, or just a friendly conversation about technology and AI/ML.
              </p>

              <div className="space-y-4 mb-8">
                <a
                  href={`mailto:${profile?.email}`}
                  className="flex items-center gap-4 group hover:scale-105 transition-transform duration-200"
                >
                  <div className="p-3 rounded-xl bg-white/20 group-hover:bg-white/30 transition-colors">
                    <Mail size={22} />
                  </div>
                  <div>
                    <div className="text-sm text-white/70">Email</div>
                    <div className="font-medium break-all">{profile?.email}</div>
                  </div>
                </a>

                <a
                  href={`tel:${profile?.phone}`}
                  className="flex items-center gap-4 group hover:scale-105 transition-transform duration-200"
                >
                  <div className="p-3 rounded-xl bg-white/20 group-hover:bg-white/30 transition-colors">
                    <Phone size={22} />
                  </div>
                  <div>
                    <div className="text-sm text-white/70">Phone</div>
                    <div className="font-medium">{profile?.phone}</div>
                  </div>
                </a>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white/20">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <div className="text-sm text-white/70">Location</div>
                    <div className="font-medium">{profile?.location}</div>
                  </div>
                </div>
              </div>

              {/* Social links */}
              {activeSocials.length > 0 && (
                <div>
                  <h4 className="text-sm text-white/70 mb-3">Follow Me</h4>
                  <div className="flex flex-wrap gap-3">
                    {activeSocials.map((social) => {
                      const Icon = getIcon(social.icon_name);
                      return (
                        <a
                          key={social.id}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200 hover:scale-110"
                          aria-label={social.platform}
                        >
                          <Icon size={20} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <MessageSquare size={18} />
                  WhatsApp
                </a>
              )}
            </div>
          </ScrollReveal>

          {/* Right - contact form */}
          <ScrollReveal animation="slide-left" delay={100}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send a Message</h3>

              {success && (
                <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 flex items-center gap-3 text-green-700 dark:text-green-400">
                  <CheckCircle2 size={20} />
                  <span className="text-sm font-medium">Message sent successfully! I'll get back to you soon.</span>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="Your name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="Your phone"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="Subject"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                    placeholder="Your message..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
