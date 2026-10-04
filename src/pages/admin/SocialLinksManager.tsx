import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Eye, EyeOff, Link2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { usePortfolio } from '@/hooks/usePortfolio';
import { AdminPageHeader, TextField, Card, ConfirmDialog } from '@/components/admin/AdminUI';
import type { SocialLink } from '@/lib/types';

const platformIcons = ['Linkedin', 'Github', 'Instagram', 'Facebook', 'Twitter', 'Youtube', 'Link', 'Globe'];

const emptyLink = {
  id: '',
  platform: '',
  url: '',
  icon_name: 'Link',
  is_active: false,
  display_order: 0,
};

export function SocialLinksManager() {
  const { socialLinks, refresh } = usePortfolio();
  const [editing, setEditing] = useState<typeof emptyLink | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.platform.trim()) { alert('Platform name is required'); return; }
    try {
      const { id, ...rest } = editing;
      if (id) {
        const { error } = await supabase.from('social_links').update(rest).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('social_links').insert(rest);
        if (error) throw error;
      }
      await refresh();
      setEditing(null);
    } catch (err) {
      alert(`Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from('social_links').delete().eq('id', deleteId);
      if (error) throw error;
      await refresh();
      setDeleteId(null);
    } catch (err) {
      alert(`Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const toggleActive = async (link: SocialLink) => {
    try {
      const { error } = await supabase.from('social_links').update({ is_active: !link.is_active }).eq('id', link.id);
      if (error) throw error;
      await refresh();
    } catch (err) {
      alert(`Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Social Media Management"
        description="Manage your social media links. Only active links with URLs appear on the public website."
        action={
          <button
            onClick={() => setEditing({ ...emptyLink, display_order: socialLinks.length + 1 })}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-md"
          >
            <Plus size={18} />
            Add Link
          </button>
        }
      />

      <div className="space-y-3">
        {socialLinks.map((link) => (
          <Card key={link.id}>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <Link2 size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{link.platform}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{link.url || 'No URL set'}</p>
                <div className="flex gap-2 mt-1">
                  {link.is_active ? (
                    <span className="text-xs px-2 py-0.5 rounded-md bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400">Active</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500">Inactive</span>
                  )}
                  {!link.url && <span className="text-xs px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">No URL</span>}
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => toggleActive(link)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500 transition-all">
                  {link.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => setEditing({ ...link })} className="px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500 transition-all text-xs">Edit</button>
                <button onClick={() => setDeleteId(link.id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </Card>
        ))}
        {socialLinks.length === 0 && (
          <Card><p className="text-center text-gray-500 dark:text-gray-400 py-8">No social links yet.</p></Card>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editing.id ? 'Edit Link' : 'Add Link'}</h2>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <TextField label="Platform Name" value={editing.platform} onChange={(v) => setEditing({ ...editing, platform: v })} required placeholder="e.g. LinkedIn, GitHub" />
              <TextField label="URL" value={editing.url} onChange={(v) => setEditing({ ...editing, url: v })} placeholder="https://..." />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Icon</label>
                <select
                  value={editing.icon_name}
                  onChange={(e) => setEditing({ ...editing, icon_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {platformIcons.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
              <TextField label="Display Order" value={String(editing.display_order)} onChange={(v) => setEditing({ ...editing, display_order: parseInt(v) || 0 })} type="number" />
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input type="checkbox" checked={editing.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} className="w-4 h-4 rounded" />
                Active (visible on public website)
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium transition-all">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all">Save</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} message="Delete this social link?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
