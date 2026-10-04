import { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { usePortfolio } from '@/hooks/usePortfolio';
import { uploadFile } from '@/services/upload';
import { AdminPageHeader, TextField, ImageUploadField, Card, ConfirmDialog } from '@/components/admin/AdminUI';
import type { Education } from '@/lib/types';

const emptyEducation: Omit<Education, 'id'> = {
  degree: '',
  institution: '',
  location: '',
  score_label: 'CGPA',
  score_value: '',
  start_year: '',
  end_year: '',
  description: '',
  institution_image_url: '',
  display_order: 0,
  is_published: true,
};

export function EducationManager() {
  const { education, refresh } = usePortfolio();
  const [editing, setEditing] = useState<(Education & { id: string }) | Omit<Education, 'id'> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSave = async () => {
    if (!editing) return;
    if (!('degree' in editing)) return;
    if (!(editing as Education).degree.trim()) {
      alert('Degree is required');
      return;
    }
    try {
      const ed = editing as Education;
      if (ed.id) {
        const { error } = await supabase.from('education').update({
          degree: ed.degree, institution: ed.institution, location: ed.location,
          score_label: ed.score_label, score_value: ed.score_value,
          start_year: ed.start_year, end_year: ed.end_year,
          description: ed.description, institution_image_url: ed.institution_image_url,
          display_order: ed.display_order, is_published: ed.is_published,
        }).eq('id', ed.id);
        if (error) throw error;
      } else {
        const { id: _id, ...rest } = ed;
        void _id;
        const { error } = await supabase.from('education').insert(rest);
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
      const { error } = await supabase.from('education').delete().eq('id', deleteId);
      if (error) throw error;
      await refresh();
      setDeleteId(null);
    } catch (err) {
      alert(`Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const togglePublish = async (edu: Education) => {
    try {
      const { error } = await supabase.from('education').update({ is_published: !edu.is_published }).eq('id', edu.id);
      if (error) throw error;
      await refresh();
    } catch (err) {
      alert(`Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Education Management"
        description="Manage your education timeline entries"
        action={
          <button
            onClick={() => setEditing({ ...emptyEducation, display_order: education.length + 1 })}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-md"
          >
            <Plus size={18} />
            Add Education
          </button>
        }
      />

      <div className="space-y-4">
        {education.map((edu) => (
          <Card key={edu.id}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {edu.institution_image_url ? (
                  <img src={edu.institution_image_url} alt={edu.institution} className="w-14 h-14 rounded-xl object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                    <GraduationCap size={28} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white">{edu.degree}</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">{edu.institution}</p>
                {edu.location && <p className="text-xs text-gray-500 dark:text-gray-400">{edu.location}</p>}
                <div className="flex gap-2 mt-2">
                  {edu.score_value && <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">{edu.score_label}: {edu.score_value}</span>}
                  {!edu.is_published && <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500">Hidden</span>}
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => togglePublish(edu)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500 transition-all">
                  {edu.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => setEditing(edu)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500 transition-all text-sm">Edit</button>
                <button onClick={() => setDeleteId(edu.id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </Card>
        ))}
        {education.length === 0 && (
          <Card><p className="text-center text-gray-500 dark:text-gray-400 py-8">No education entries yet.</p></Card>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{(editing as Education).id ? 'Edit Education' : 'Add Education'}</h2>
            <div className="space-y-4">
              <TextField label="Degree" value={(editing as Education).degree} onChange={(v) => setEditing({ ...editing, degree: v })} required />
              <TextField label="Institution" value={(editing as Education).institution} onChange={(v) => setEditing({ ...editing, institution: v })} required />
              <TextField label="Location" value={(editing as Education).location} onChange={(v) => setEditing({ ...editing, location: v })} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Score Label</label>
                  <select value={(editing as Education).score_label} onChange={(e) => setEditing({ ...editing, score_label: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>CGPA</option>
                    <option>Percentage</option>
                    <option>GPA</option>
                    <option>Grade</option>
                  </select>
                </div>
                <TextField label="Score Value" value={(editing as Education).score_value} onChange={(v) => setEditing({ ...editing, score_value: v })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <TextField label="Start Year" value={(editing as Education).start_year} onChange={(v) => setEditing({ ...editing, start_year: v })} />
                <TextField label="End Year" value={(editing as Education).end_year} onChange={(v) => setEditing({ ...editing, end_year: v })} />
              </div>
              <TextField label="Description" value={(editing as Education).description} onChange={(v) => setEditing({ ...editing, description: v })} textarea rows={3} />
              <ImageUploadField label="Institution Image" value={(editing as Education).institution_image_url} onChange={(v) => setEditing({ ...editing, institution_image_url: v })} folder="education" onUpload={uploadFile} />
              <TextField label="Display Order" value={String((editing as Education).display_order)} onChange={(v) => setEditing({ ...editing, display_order: parseInt(v) || 0 })} type="number" />
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input type="checkbox" checked={(editing as Education).is_published} onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} className="w-4 h-4 rounded" />
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

      <ConfirmDialog open={!!deleteId} message="Delete this education entry?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
