import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { usePortfolio } from '@/hooks/usePortfolio';
import { uploadFile } from '@/services/upload';
import { AdminPageHeader, SaveButton, TextField, ImageUploadField, Card } from '@/components/admin/AdminUI';

export function SeoSettingsManager() {
  const { seo, refresh } = usePortfolio();
  const [form, setForm] = useState({
    meta_title: '',
    meta_description: '',
    keywords: '',
    og_title: '',
    og_description: '',
    og_image: '',
    twitter_card: 'summary_large_image',
    canonical_url: '',
    robots: 'index, follow',
    json_ld: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (seo) {
      setForm({
        meta_title: seo.meta_title || '',
        meta_description: seo.meta_description || '',
        keywords: seo.keywords || '',
        og_title: seo.og_title || '',
        og_description: seo.og_description || '',
        og_image: seo.og_image || '',
        twitter_card: seo.twitter_card || 'summary_large_image',
        canonical_url: seo.canonical_url || '',
        robots: seo.robots || 'index, follow',
        json_ld: seo.json_ld ? JSON.stringify(seo.json_ld, null, 2) : '',
      });
    }
  }, [seo]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      let jsonLd: Record<string, unknown> = {};
      if (form.json_ld.trim()) {
        try {
          jsonLd = JSON.parse(form.json_ld);
        } catch {
          alert('JSON-LD is not valid JSON. Please check the format.');
          setSaving(false);
          return;
        }
      }

      const payload = { ...form, json_ld: jsonLd };
      if (seo?.id) {
        const { error } = await supabase.from('seo_settings').update(payload).eq('id', seo.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('seo_settings').insert(payload);
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
        title="SEO Settings"
        description="Configure meta tags, Open Graph, and structured data"
        action={<SaveButton onSave={handleSave} saving={saving} />}
      />

      {saved && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm font-medium">
          SEO settings saved successfully!
        </div>
      )}

      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Meta Tags</h2>
          <div className="space-y-4">
            <TextField label="Meta Title" value={form.meta_title} onChange={(v) => setForm({ ...form, meta_title: v })} />
            <TextField label="Meta Description" value={form.meta_description} onChange={(v) => setForm({ ...form, meta_description: v })} textarea rows={2} />
            <TextField label="Keywords" value={form.keywords} onChange={(v) => setForm({ ...form, keywords: v })} placeholder="comma-separated keywords" />
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Canonical URL" value={form.canonical_url} onChange={(v) => setForm({ ...form, canonical_url: v })} />
              <TextField label="Robots" value={form.robots} onChange={(v) => setForm({ ...form, robots: v })} />
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Open Graph</h2>
          <div className="space-y-4">
            <TextField label="OG Title" value={form.og_title} onChange={(v) => setForm({ ...form, og_title: v })} />
            <TextField label="OG Description" value={form.og_description} onChange={(v) => setForm({ ...form, og_description: v })} textarea rows={2} />
            <ImageUploadField label="OG Image" value={form.og_image} onChange={(v) => setForm({ ...form, og_image: v })} folder="seo" onUpload={uploadFile} />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Twitter Card Type</label>
              <select
                value={form.twitter_card}
                onChange={(e) => setForm({ ...form, twitter_card: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="summary">Summary</option>
                <option value="summary_large_image">Summary with Large Image</option>
                <option value="app">App</option>
                <option value="player">Player</option>
              </select>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">JSON-LD Structured Data</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">JSON-LD (valid JSON)</label>
            <textarea
              value={form.json_ld}
              onChange={(e) => setForm({ ...form, json_ld: e.target.value })}
              rows={10}
              placeholder='{"@context":"https://schema.org","@type":"Person","name":"Kumbam Hari Krishna Reddy"}'
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <SaveButton onSave={handleSave} saving={saving} />
        </div>
      </div>
    </div>
  );
}
