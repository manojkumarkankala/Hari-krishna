import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { usePortfolio } from '@/hooks/usePortfolio';
import { AdminPageHeader, TextField, Card, ConfirmDialog } from '@/components/admin/AdminUI';
import type { Skill } from '@/lib/types';

export function SkillsManager() {
  const { skills, refresh } = usePortfolio();
  const [items, setItems] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setItems(skills);
  }, [skills]);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.name.trim()) {
      alert('Skill name is required');
      return;
    }
    try {
      if (editing.id) {
        const { error } = await supabase.from('skills').update({
          name: editing.name,
          category: editing.category,
          icon_name: editing.icon_name,
          proficiency: editing.proficiency,
          display_order: editing.display_order,
          is_published: editing.is_published,
        }).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('skills').insert({
          name: editing.name,
          category: editing.category,
          icon_name: editing.icon_name,
          proficiency: editing.proficiency,
          display_order: editing.display_order,
          is_published: editing.is_published,
        });
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
      const { error } = await supabase.from('skills').delete().eq('id', deleteId);
      if (error) throw error;
      await refresh();
      setDeleteId(null);
    } catch (err) {
      alert(`Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const togglePublish = async (skill: Skill) => {
    try {
      const { error } = await supabase.from('skills').update({ is_published: !skill.is_published }).eq('id', skill.id);
      if (error) throw error;
      await refresh();
    } catch (err) {
      alert(`Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Skills Management"
        description="Add, edit, and manage your technical skills"
        action={
          <button
            onClick={() => setEditing({ id: '', name: '', category: 'Programming', icon_name: 'Code', proficiency: 0, display_order: items.length + 1, is_published: true })}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-md"
          >
            <Plus size={18} />
            Add Skill
          </button>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((skill) => (
          <Card key={skill.id}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{skill.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{skill.category}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => togglePublish(skill)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500 transition-all">
                  {skill.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => setEditing(skill)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500 transition-all text-sm">Edit</button>
                <button onClick={() => setDeleteId(skill.id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            {skill.proficiency > 0 && (
              <div className="mt-3">
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${skill.proficiency}%` }} />
                </div>
                <span className="text-xs text-gray-400 mt-1 block">{skill.proficiency}% proficiency</span>
              </div>
            )}
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <Card>
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">No skills yet. Click "Add Skill" to create one.</p>
        </Card>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{editing.id ? 'Edit Skill' : 'Add Skill'}</h2>
            <div className="space-y-4">
              <TextField label="Skill Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} required />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option>Programming</option>
                  <option>Web Technologies</option>
                  <option>Database</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Icon Name</label>
                <select
                  value={editing.icon_name}
                  onChange={(e) => setEditing({ ...editing, icon_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option>Code</option>
                  <option>Coffee</option>
                  <option>Globe</option>
                  <option>Palette</option>
                  <option>Database</option>
                  <option>Server</option>
                  <option>Cloud</option>
                  <option>Cpu</option>
                  <option>Brain</option>
                  <option>BarChart3</option>
                  <option>GitBranch</option>
                  <option>Smartphone</option>
                  <option>Layers</option>
                  <option>Zap</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Proficiency: {editing.proficiency}%</label>
                <input type="range" min="0" max="100" value={editing.proficiency} onChange={(e) => setEditing({ ...editing, proficiency: parseInt(e.target.value) })} className="w-full" />
              </div>
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

      <ConfirmDialog
        open={!!deleteId}
        message="Are you sure you want to delete this skill?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
