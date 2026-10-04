import { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, EyeOff, Briefcase, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { usePortfolio } from '@/hooks/usePortfolio';
import { uploadFile } from '@/services/upload';
import { AdminPageHeader, TextField, ImageUploadField, Card, ConfirmDialog } from '@/components/admin/AdminUI';
import type { Project } from '@/lib/types';

const emptyProject = {
  id: '',
  title: '',
  description: '',
  technologies: [] as string[],
  features: [] as string[],
  image_url: '',
  video_url: '',
  github_url: '',
  live_url: '',
  project_date: '',
  status: 'completed',
  display_order: 0,
  is_published: true,
};

export function ProjectsManager() {
  const { projects, refresh } = usePortfolio();
  const [editing, setEditing] = useState<typeof emptyProject | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title.trim()) { alert('Title is required'); return; }
    try {
      const { id, ...rest } = editing;
      if (id) {
        const { error } = await supabase.from('projects').update(rest).eq('id', id);
        if (error) throw error;
      } else {
        const { id: _id, ...insertData } = rest;
        void _id;
        const { error } = await supabase.from('projects').insert(insertData);
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
      const { error } = await supabase.from('projects').delete().eq('id', deleteId);
      if (error) throw error;
      await refresh();
      setDeleteId(null);
    } catch (err) {
      alert(`Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const togglePublish = async (proj: Project) => {
    try {
      const { error } = await supabase.from('projects').update({ is_published: !proj.is_published }).eq('id', proj.id);
      if (error) throw error;
      await refresh();
    } catch (err) {
      alert(`Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const addTech = () => {
    if (!editing || !techInput.trim()) return;
    setEditing({ ...editing, technologies: [...editing.technologies, techInput.trim()] });
    setTechInput('');
  };

  const addFeature = () => {
    if (!editing || !featureInput.trim()) return;
    setEditing({ ...editing, features: [...editing.features, featureInput.trim()] });
    setFeatureInput('');
  };

  return (
    <div>
      <AdminPageHeader
        title="Projects Management"
        description="Add, edit, and manage your portfolio projects"
        action={
          <button
            onClick={() => setEditing({ ...emptyProject, display_order: projects.length + 1 })}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-md"
          >
            <Plus size={18} />
            Add Project
          </button>
        }
      />

      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((proj) => (
          <Card key={proj.id}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-gray-700 dark:to-gray-900">
                {proj.image_url ? (
                  <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-blue-400">
                    <Briefcase size={28} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{proj.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{proj.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {proj.technologies.slice(0, 3).map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">{t}</span>
                  ))}
                </div>
                <span className={`text-xs mt-1 inline-block ${proj.status === 'completed' ? 'text-green-500' : 'text-amber-500'}`}>{proj.status}</span>
              </div>
              <div className="flex flex-col gap-1 flex-shrink-0">
                <button onClick={() => togglePublish(proj)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500 transition-all">
                  {proj.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => setEditing({ ...proj })} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500 transition-all text-xs">Edit</button>
                <button onClick={() => setDeleteId(proj.id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </Card>
        ))}
        {projects.length === 0 && (
          <Card><p className="text-center text-gray-500 dark:text-gray-400 py-8">No projects yet.</p></Card>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editing.id ? 'Edit Project' : 'Add Project'}</h2>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <TextField label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} required />
              <TextField label="Description" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} textarea rows={4} />

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Technologies</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                    placeholder="Add technology..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button onClick={addTech} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editing.technologies.map((t, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-sm">
                      {t}
                      <button onClick={() => setEditing({ ...editing, technologies: editing.technologies.filter((_, idx) => idx !== i) })}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Features</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                    placeholder="Add feature..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button onClick={addFeature} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium">Add</button>
                </div>
                <div className="space-y-1">
                  {editing.features.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300">
                      {f}
                      <button onClick={() => setEditing({ ...editing, features: editing.features.filter((_, idx) => idx !== i) })} className="text-red-400">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <ImageUploadField label="Project Image" value={editing.image_url} onChange={(v) => setEditing({ ...editing, image_url: v })} folder="projects" onUpload={uploadFile} />
              <TextField label="GitHub URL" value={editing.github_url} onChange={(v) => setEditing({ ...editing, github_url: v })} />
              <TextField label="Live Demo URL" value={editing.live_url} onChange={(v) => setEditing({ ...editing, live_url: v })} />
              <TextField label="Video URL" value={editing.video_url} onChange={(v) => setEditing({ ...editing, video_url: v })} />
              <div className="grid grid-cols-2 gap-4">
                <TextField label="Project Date" value={editing.project_date} onChange={(v) => setEditing({ ...editing, project_date: v })} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                  <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="planned">Planned</option>
                  </select>
                </div>
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

      <ConfirmDialog open={!!deleteId} message="Delete this project?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
