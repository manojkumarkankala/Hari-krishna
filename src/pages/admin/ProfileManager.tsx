import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { usePortfolio } from '@/hooks/usePortfolio';
import { uploadFile } from '@/services/upload';
import { AdminPageHeader, SaveButton, TextField, ImageUploadField, Card } from '@/components/admin/AdminUI';

export function ProfileManager() {
  const { profile, refresh } = usePortfolio();
  const [form, setForm] = useState({
    full_name: '',
    professional_title: '',
    email: '',
    phone: '',
    location: '',
    career_objective: '',
    short_bio: '',
    profile_image_url: '',
    hero_heading: '',
    hero_subtitle: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        professional_title: profile.professional_title || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        career_objective: profile.career_objective || '',
        short_bio: profile.short_bio || '',
        profile_image_url: profile.profile_image_url || '',
        hero_heading: profile.hero_heading || '',
        hero_subtitle: profile.hero_subtitle || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      if (profile?.id) {
        const { error } = await supabase.from('profiles').update(form).eq('id', profile.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('profiles').insert(form);
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

  const handleUpload = async (file: File, folder: string) => {
    return uploadFile(file, folder);
  };

  return (
    <div>
      <AdminPageHeader
        title="Profile Management"
        description="Edit your personal information displayed on the website"
        action={<SaveButton onSave={handleSave} saving={saving} />}
      />

      {saved && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm font-medium">
          Profile saved successfully!
        </div>
      )}

      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Basic Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField label="Full Name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} required />
            <TextField label="Professional Title" value={form.professional_title} onChange={(v) => setForm({ ...form, professional_title: v })} />
            <TextField label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} type="email" />
            <TextField label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <TextField label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Hero Section</h2>
          <div className="space-y-4">
            <TextField label="Hero Heading" value={form.hero_heading} onChange={(v) => setForm({ ...form, hero_heading: v })} />
            <TextField label="Hero Subtitle" value={form.hero_subtitle} onChange={(v) => setForm({ ...form, hero_subtitle: v })} />
            <ImageUploadField label="Profile Image" value={form.profile_image_url} onChange={(v) => setForm({ ...form, profile_image_url: v })} folder="profile" onUpload={handleUpload} />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">About Content</h2>
          <div className="space-y-4">
            <TextField label="Career Objective" value={form.career_objective} onChange={(v) => setForm({ ...form, career_objective: v })} textarea rows={4} />
            <TextField label="Short Bio" value={form.short_bio} onChange={(v) => setForm({ ...form, short_bio: v })} textarea rows={4} />
          </div>
        </Card>

        <div className="flex justify-end">
          <SaveButton onSave={handleSave} saving={saving} />
        </div>
      </div>
    </div>
  );
}
