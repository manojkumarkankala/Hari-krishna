import { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, Trophy, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { usePortfolio } from '@/hooks/usePortfolio';
import { AdminPageHeader, TextField, Card, ConfirmDialog } from '@/components/admin/AdminUI';
import type { Achievement } from '@/lib/types';

const emptyAchievement = {
  id: '',
  title: '',
  description: '',
  organization: '',
  date: '',
  display_order: 0,
  is_published: true,
};

export function AchievementsManager() {
  const { achievements, refresh } = usePortfolio();
  const [editing, setEditing] = useState<typeof emptyAchievement | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title.trim()) { alert('Title is required'); return; }
    try {
      const { id, ...rest } = editing;
      if (id) {
        const { error } = await supabase.from('achievements').update(rest).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('achievements').insert(rest);
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
      const { error } = await supabase.from('achievements').delete().eq('id', deleteId);
      if (error) throw error;
      await refresh();
      setDeleteId(null);
    } catch (err) {
      alert(`Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const togglePublish = async (ach: Achievement) => {
    try {
      const { error } = await supabase.from('achievements').update({ is_published: !ach.is_published }).eq('id', ach.id);
      if (error) throw error;
      await refresh();
    } catch (err) {
      alert(`Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Achievements Management"
        description="Add, edit, and manage your achievements"
        action={
          <button
            onClick={() => setEditing({ ...emptyAchievement, display_order: achievements.length + 1 })}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-md"
          >
            <Plus size={18} />
            Add Achievement
          </button>
        }
      />

      <div className="grid sm:grid-cols-2 gap-4">
        {achievements.map((ach) => (
          <Card key={ach.id}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                <Trophy size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{ach.title}</h3>
                <p className="text-xs text-amber-600 dark:text-amber-400">{ach.organization}</p>
                {ach.date && <p className="text-xs text-gray-400 mt-1">{ach.date}</p>}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => togglePublish(ach)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500 transition-all">
                  {ach.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => setEditing({ ...ach })} className="px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500 transition-all text-xs">Edit</button>
                <button onClick={() => setDeleteId(ach.id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </Card>
        ))}
        {achievements.length === 0 && (
          <Card><p className="text-center text-gray-500 dark:text-gray-400 py-8">No achievements yet.</p></Card>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editing.id ? 'Edit Achievement' : 'Add Achievement'}</h2>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <TextField label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} required />
              <TextField label="Organization" value={editing.organization} onChange={(v) => setEditing({ ...editing, organization: v })} />
              <TextField label="Date" value={editing.date} onChange={(v) => setEditing({ ...editing, date: v })} />
              <TextField label="Description" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} textarea rows={3} />
              <TextField label="Display Order" value={String(editing.display_order)} onChange={(v) => setEditing({ ...editing, display_order: parseInt(v) || 0 })} type="number" />
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input type="checkbox" checked={editing.is_published} onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} className="w-4 h-4 rounded" />
                Published
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium transition-all">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all">Save</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} message="Delete this achievement?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
