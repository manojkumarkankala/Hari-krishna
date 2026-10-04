import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { usePortfolio } from '@/hooks/usePortfolio';
import { uploadFile } from '@/services/upload';
import { AdminPageHeader, SaveButton, TextField, ImageUploadField, Card } from '@/components/admin/AdminUI';

export function WebsiteSettingsManager() {
  const { settings, refresh } = usePortfolio();
  const [form, setForm] = useState({
    website_title: '',
    website_description: '',
    logo_url: '',
    favicon_url: '',
    primary_color: '#2563eb',
    secondary_color: '#0ea5e9',
    hero_heading: '',
    hero_subtitle: '',
    footer_text: '',
    copyright_text: '',
    contact_email: '',
    contact_phone: '',
    google_analytics_id: '',
    google_search_console: '',
    social_sharing_image: '',
    dark_mode_default: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        website_title: settings.website_title || '',
        website_description: settings.website_description || '',
        logo_url: settings.logo_url || '',
        favicon_url: settings.favicon_url || '',
        primary_color: settings.primary_color || '#2563eb',
        secondary_color: settings.secondary_color || '#0ea5e9',
        hero_heading: settings.hero_heading || '',
        hero_subtitle: settings.hero_subtitle || '',
        footer_text: settings.footer_text || '',
        copyright_text: settings.copyright_text || '',
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        google_analytics_id: settings.google_analytics_id || '',
        google_search_console: settings.google_search_console || '',
        social_sharing_image: settings.social_sharing_image || '',
        dark_mode_default: settings.dark_mode_default ?? true,
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      if (settings?.id) {
        const { error } = await supabase.from('website_settings').update(form).eq('id', settings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('website_settings').insert(form);
        if (error) throw error;
      }
      await refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(`Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Website Settings"
        description="Configure site-wide settings"
        action={<SaveButton onSave={handleSave} saving={saving} />}
      />

      {saved && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm font-medium">
          Settings saved successfully!
        </div>
      )}

      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">General</h2>
          <div className="space-y-4">
            <TextField label="Website Title" value={form.website_title} onChange={(v) => setForm({ ...form, website_title: v })} />
            <TextField label="Website Description" value={form.website_description} onChange={(v) => setForm({ ...form, website_description: v })} textarea rows={2} />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Branding</h2>
          <div className="space-y-4">
            <ImageUploadField label="Logo" value={form.logo_url} onChange={(v) => setForm({ ...form, logo_url: v })} folder="branding" onUpload={uploadFile} />
            <ImageUploadField label="Favicon" value={form.favicon_url} onChange={(v) => setForm({ ...form, favicon_url: v })} folder="branding" onUpload={uploadFile} />
            <ImageUploadField label="Social Sharing Image" value={form.social_sharing_image} onChange={(v) => setForm({ ...form, social_sharing_image: v })} folder="branding" onUpload={uploadFile} />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Primary Color</label>
                <div className="flex gap-2">
                  <input type="color" value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} className="w-12 h-12 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer" />
                  <input type="text" value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Secondary Color</label>
                <div className="flex gap-2">
                  <input type="color" value={form.secondary_color} onChange={(e) => setForm({ ...form, secondary_color: e.target.value })} className="w-12 h-12 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer" />
                  <input type="text" value={form.secondary_color} onChange={(e) => setForm({ ...form, secondary_color: e.target.value })} className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Hero Section</h2>
          <div className="space-y-4">
            <TextField label="Hero Heading" value={form.hero_heading} onChange={(v) => setForm({ ...form, hero_heading: v })} />
            <TextField label="Hero Subtitle" value={form.hero_subtitle} onChange={(v) => setForm({ ...form, hero_subtitle: v })} />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Footer & Contact</h2>
          <div className="space-y-4">
            <TextField label="Footer Text" value={form.footer_text} onChange={(v) => setForm({ ...form, footer_text: v })} textarea rows={2} />
            <TextField label="Copyright Text" value={form.copyright_text} onChange={(v) => setForm({ ...form, copyright_text: v })} />
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Contact Email" value={form.contact_email} onChange={(v) => setForm({ ...form, contact_email: v })} type="email" />
              <TextField label="Contact Phone" value={form.contact_phone} onChange={(v) => setForm({ ...form, contact_phone: v })} />
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Analytics & Verification</h2>
          <div className="space-y-4">
            <TextField label="Google Analytics ID" value={form.google_analytics_id} onChange={(v) => setForm({ ...form, google_analytics_id: v })} placeholder="G-XXXXXXXXXX" />
            <TextField label="Google Search Console Verification" value={form.google_search_console} onChange={(v) => setForm({ ...form, google_search_console: v })} />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Theme</h2>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input type="checkbox" checked={form.dark_mode_default} onChange={(e) => setForm({ ...form, dark_mode_default: e.target.checked })} className="w-4 h-4 rounded" />
            Use dark mode as default
          </label>
        </Card>

        <div className="flex justify-end">
          <SaveButton onSave={handleSave} saving={saving} />
        </div>
      </div>
    </div>
  );
}
