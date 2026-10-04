import { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, Award, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { usePortfolio } from '@/hooks/usePortfolio';
import { uploadFile } from '@/services/upload';
import { AdminPageHeader, TextField, ImageUploadField, Card, ConfirmDialog } from '@/components/admin/AdminUI';
import type { Certificate } from '@/lib/types';

const emptyCert = {
  id: '',
  name: '',
  issuing_organization: '',
  issue_date: '',
  description: '',
  image_url: '',
  pdf_url: '',
  certificate_url: '',
  display_order: 0,
  is_published: true,
};

export function CertificatesManager() {
  const { certificates, refresh } = usePortfolio();
  const [editing, setEditing] = useState<typeof emptyCert | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.name.trim()) { alert('Certificate name is required'); return; }
    try {
      const { id, ...rest } = editing;
      if (id) {
        const { error } = await supabase.from('certificates').update(rest).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('certificates').insert(rest);
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
      const { error } = await supabase.from('certificates').delete().eq('id', deleteId);
      if (error) throw error;
      await refresh();
      setDeleteId(null);
    } catch (err) {
      alert(`Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const togglePublish = async (cert: Certificate) => {
    try {
      const { error } = await supabase.from('certificates').update({ is_published: !cert.is_published }).eq('id', cert.id);
      if (error) throw error;
      await refresh();
    } catch (err) {
      alert(`Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Certificates Management"
        description="Add, edit, and manage your certificates"
        action={
          <button
            onClick={() => setEditing({ ...emptyCert, display_order: certificates.length + 1 })}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-md"
          >
            <Plus size={18} />
            Add Certificate
          </button>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {certificates.map((cert) => (
          <Card key={cert.id}>
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-gray-700 dark:to-gray-900">
                {cert.image_url ? (
                  <img src={cert.image_url} alt={cert.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-blue-400">
                    <Award size={24} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{cert.name}</h3>
                <p className="text-xs text-blue-600 dark:text-blue-400">{cert.issuing_organization}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => togglePublish(cert)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500 transition-all">
                {cert.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button onClick={() => setEditing({ ...cert })} className="px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500 transition-all text-xs">Edit</button>
              <button onClick={() => setDeleteId(cert.id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500 transition-all">
                <Trash2 size={16} />
              </button>
            </div>
          </Card>
        ))}
        {certificates.length === 0 && (
          <Card><p className="text-center text-gray-500 dark:text-gray-400 py-8">No certificates yet.</p></Card>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editing.id ? 'Edit Certificate' : 'Add Certificate'}</h2>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <TextField label="Certificate Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} required />
              <TextField label="Issuing Organization" value={editing.issuing_organization} onChange={(v) => setEditing({ ...editing, issuing_organization: v })} />
              <TextField label="Issue Date" value={editing.issue_date} onChange={(v) => setEditing({ ...editing, issue_date: v })} />
              <TextField label="Description" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} textarea rows={3} />
              <ImageUploadField label="Certificate Image" value={editing.image_url} onChange={(v) => setEditing({ ...editing, image_url: v })} folder="certificates" onUpload={uploadFile} />
              <TextField label="PDF URL" value={editing.pdf_url} onChange={(v) => setEditing({ ...editing, pdf_url: v })} />
              <TextField label="Certificate URL" value={editing.certificate_url} onChange={(v) => setEditing({ ...editing, certificate_url: v })} />
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

      <ConfirmDialog open={!!deleteId} message="Delete this certificate?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
